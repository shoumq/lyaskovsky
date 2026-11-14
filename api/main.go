package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net"
	"net/http"
	"os"
	"regexp"
	"strings"
	"sync"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type lead struct {
	Name    string `json:"name"`
	Company string `json:"company"`
	Email   string `json:"email"`
	Phone   string `json:"phone"`
	Service string `json:"service"`
	Message string `json:"message"`
	Consent bool   `json:"consent"`
	Website string `json:"website"`
}
type reply struct {
	Error string `json:"error,omitempty"`
	ID    string `json:"id,omitempty"`
}
type visitor struct {
	Count int
	Reset time.Time
}
type limiter struct {
	mu      sync.Mutex
	entries map[string]visitor
}

func (l *limiter) allow(ip string) bool {
	l.mu.Lock()
	defer l.mu.Unlock()
	now := time.Now()
	if len(l.entries) > 10000 {
		for k, v := range l.entries {
			if now.After(v.Reset) {
				delete(l.entries, k)
			}
		}
	}
	v := l.entries[ip]
	if now.After(v.Reset) {
		v = visitor{Reset: now.Add(time.Hour)}
	}
	if v.Count >= 5 {
		return false
	}
	v.Count++
	l.entries[ip] = v
	return true
}

var emailRx = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
var phoneRx = regexp.MustCompile(`^[+\d\s()\-]{7,25}$`)
var allowed = map[string]bool{"IT-консалтинг": true, "Разработка программного обеспечения": true, "Автоматизация процессов": true, "Системная интеграция": true, "Искусственный интеллект": true, "Техническое сопровождение": true}

func valid(v lead) bool {
	return len(strings.TrimSpace(v.Name)) >= 2 && len(v.Name) <= 120 && len(v.Company) <= 180 && len(v.Email) <= 254 && emailRx.MatchString(v.Email) && (v.Phone == "" || phoneRx.MatchString(v.Phone)) && (v.Service == "" || allowed[v.Service]) && len(strings.TrimSpace(v.Message)) >= 20 && len(v.Message) <= 5000 && v.Consent
}
func ipFromRequest(r *http.Request) string {
	if forwarded := net.ParseIP(r.Header.Get("X-Real-IP")); forwarded != nil {
		return forwarded.String()
	}
	host, _, err := net.SplitHostPort(r.RemoteAddr)
	if err != nil {
		return r.RemoteAddr
	}
	return host
}
func jsonReply(w http.ResponseWriter, status int, v reply) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("Cache-Control", "no-store")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(v)
}
func leadHandler(db *pgxpool.Pool, limit *limiter) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			w.Header().Set("Allow", "POST")
			jsonReply(w, http.StatusMethodNotAllowed, reply{Error: "Метод не поддерживается."})
			return
		}
		if !limit.allow(ipFromRequest(r)) {
			jsonReply(w, http.StatusTooManyRequests, reply{Error: "Слишком много запросов. Повторите попытку позднее."})
			return
		}
		if !strings.HasPrefix(r.Header.Get("Content-Type"), "application/json") {
			jsonReply(w, http.StatusUnsupportedMediaType, reply{Error: "Неверный формат данных."})
			return
		}
		r.Body = http.MaxBytesReader(w, r.Body, 16<<10)
		var v lead
		dec := json.NewDecoder(r.Body)
		dec.DisallowUnknownFields()
		if err := dec.Decode(&v); err != nil {
			jsonReply(w, http.StatusBadRequest, reply{Error: "Проверьте данные формы."})
			return
		}
		var extra any
		if err := dec.Decode(&extra); err != io.EOF {
			jsonReply(w, http.StatusBadRequest, reply{Error: "Проверьте данные формы."})
			return
		}
		if v.Website != "" {
			jsonReply(w, http.StatusBadRequest, reply{Error: "Проверьте данные формы."})
			return
		}
		if !valid(v) {
			jsonReply(w, http.StatusUnprocessableEntity, reply{Error: "Проверьте обязательные поля формы."})
			return
		}
		ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
		defer cancel()
		var id string
		err := db.QueryRow(ctx, `INSERT INTO leads (name,company,email,phone,service,message,consent) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id`, strings.TrimSpace(v.Name), strings.TrimSpace(v.Company), strings.TrimSpace(v.Email), strings.TrimSpace(v.Phone), v.Service, strings.TrimSpace(v.Message), v.Consent).Scan(&id)
		if err != nil {
			log.Print("lead persistence failed")
			jsonReply(w, http.StatusServiceUnavailable, reply{Error: "Не удалось сохранить обращение. Попробуйте позднее."})
			return
		}
		jsonReply(w, http.StatusCreated, reply{ID: id})
	}
}
func main() {
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		log.Fatal("DATABASE_URL is required")
	}
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	db, err := pgxpool.New(ctx, dsn)
	if err != nil {
		log.Fatal("database connection failed")
	}
	defer db.Close()
	if err = db.Ping(ctx); err != nil {
		log.Fatal("database unavailable")
	}
	if _, err = db.Exec(ctx, `CREATE EXTENSION IF NOT EXISTS pgcrypto; CREATE TABLE IF NOT EXISTS leads (id uuid PRIMARY KEY DEFAULT gen_random_uuid(), name text NOT NULL, company text NOT NULL, email text NOT NULL, phone text NOT NULL DEFAULT '', service text NOT NULL, message text NOT NULL, consent boolean NOT NULL, created_at timestamptz NOT NULL DEFAULT now())`); err != nil {
		log.Fatal("database migration failed")
	}
	limit := &limiter{entries: make(map[string]visitor)}
	mux := http.NewServeMux()
	mux.HandleFunc("POST /api/v1/leads", leadHandler(db, limit))
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) { w.WriteHeader(http.StatusNoContent) })
	server := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second, ReadTimeout: 10 * time.Second, WriteTimeout: 10 * time.Second, IdleTimeout: 60 * time.Second}
	log.Print("API listening on :8080")
	log.Fatal(server.ListenAndServe())
}
