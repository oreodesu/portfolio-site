FROM golang:1.22-alpine AS build
WORKDIR /src
COPY go.mod ./
COPY . .
# go.sum はコミットしていないため、ビルド時に go mod tidy で解決する
RUN go mod tidy && CGO_ENABLED=0 go build -o /out/todo-api ./cmd/server

FROM alpine:3.20
RUN adduser -D -u 10001 appuser
WORKDIR /app
COPY --from=build /out/todo-api ./todo-api
RUN mkdir -p /data && chown -R appuser /data /app
USER appuser
EXPOSE 8080
ENTRYPOINT ["./todo-api"]
