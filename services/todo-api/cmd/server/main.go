package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"

	"github.com/example/portfolio-site/todo-api/internal/db"
	"github.com/example/portfolio-site/todo-api/internal/handler"
	"github.com/example/portfolio-site/todo-api/internal/repository"
)

func main() {
	dbPath := getEnv("TODO_DB_PATH", "./todo.db")
	port := getEnv("TODO_API_PORT", "8080")

	conn, err := db.New(dbPath)
	if err != nil {
		log.Fatalf("failed to open db: %v", err)
	}
	defer conn.Close()

	repo := repository.NewTodoRepository(conn)
	todoHandler := handler.NewTodoHandler(repo)

	router := gin.Default()
	router.GET("/healthz", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})
	todoHandler.Register(router.Group("/"))

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("server error: %v", err)
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
