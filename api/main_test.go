package main

import "testing"

func TestValidLead(t *testing.T) {
	v := lead{Name: "Иван", Company: "Компания", Email: "ivan@example.ru", Service: "IT-консалтинг", Message: "Нужна оценка текущих систем и план развития.", Consent: true}
	if !valid(v) {
		t.Fatal("valid lead rejected")
	}
	v.Consent = false
	if valid(v) {
		t.Fatal("lead without consent accepted")
	}
	v.Consent = true
	v.Email = "bad"
	if valid(v) {
		t.Fatal("invalid email accepted")
	}
}
func TestLimiter(t *testing.T) {
	l := &limiter{entries: map[string]visitor{}}
	for i := 0; i < 5; i++ {
		if !l.allow("127.0.0.1") {
			t.Fatal("blocked early")
		}
	}
	if l.allow("127.0.0.1") {
		t.Fatal("limit not enforced")
	}
}

func TestOptionalLeadDetails(t *testing.T) {
	v := lead{Name: "Иван", Email: "ivan@example.ru", Message: "Нужна оценка текущих систем и план развития.", Consent: true}
	if !valid(v) {
		t.Fatal("minimal lead rejected")
	}
	v.Service = "unknown"
	if valid(v) {
		t.Fatal("unknown service accepted")
	}
	v.Service = ""
	v.Company = string(make([]byte, 181))
	if valid(v) {
		t.Fatal("oversized company accepted")
	}
}
