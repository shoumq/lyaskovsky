FROM golang:1.27-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 go build -o /api .
FROM alpine:3.22
COPY --from=builder /api /api
EXPOSE 8080
CMD ["/api"]
