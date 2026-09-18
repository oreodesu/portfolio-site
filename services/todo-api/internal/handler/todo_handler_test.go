package handler

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"path/filepath"
	"strconv"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"github.com/example/portfolio-site/todo-api/internal/db"
	"github.com/example/portfolio-site/todo-api/internal/model"
	"github.com/example/portfolio-site/todo-api/internal/repository"
)

func newTestRouter(t *testing.T) *gin.Engine {
	t.Helper()

	gin.SetMode(gin.TestMode)

	conn, err := db.New(filepath.Join(t.TempDir(), "todo.db"))
	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}
	t.Cleanup(func() {
		if err := conn.Close(); err != nil {
			t.Errorf("failed to close test db: %v", err)
		}
	})

	router := gin.New()
	NewTodoHandler(repository.NewTodoRepository(conn)).Register(router.Group("/"))
	return router
}

func doRequest(t *testing.T, router *gin.Engine, method, path, body string) *httptest.ResponseRecorder {
	t.Helper()

	req := httptest.NewRequest(method, path, strings.NewReader(body))
	if body != "" {
		req.Header.Set("Content-Type", "application/json")
	}

	rec := httptest.NewRecorder()
	router.ServeHTTP(rec, req)
	return rec
}

func decodeTodo(t *testing.T, rec *httptest.ResponseRecorder) model.Todo {
	t.Helper()

	var todo model.Todo
	if err := json.NewDecoder(rec.Body).Decode(&todo); err != nil {
		t.Fatalf("failed to decode response body: %v", err)
	}
	return todo
}

func TestCreateTodo(t *testing.T) {
	router := newTestRouter(t)

	rec := doRequest(t, router, http.MethodPost, "/todos", `{"title":"牛乳を買う"}`)

	if rec.Code != http.StatusCreated {
		t.Fatalf("status = %d, want %d (body: %s)", rec.Code, http.StatusCreated, rec.Body.String())
	}

	todo := decodeTodo(t, rec)
	if todo.Title != "牛乳を買う" {
		t.Errorf("title = %q, want %q", todo.Title, "牛乳を買う")
	}
	if todo.Done {
		t.Error("done = true, want false")
	}
}

func TestCreateTodoRejectsMissingTitle(t *testing.T) {
	router := newTestRouter(t)

	rec := doRequest(t, router, http.MethodPost, "/todos", `{}`)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d (body: %s)", rec.Code, http.StatusBadRequest, rec.Body.String())
	}
}

func TestListTodosReturnsEmptyArray(t *testing.T) {
	router := newTestRouter(t)

	rec := doRequest(t, router, http.MethodGet, "/todos", "")

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusOK)
	}

	// フロントエンドが `.map()` できるよう、空でも `null` ではなく `[]` を返す
	if got := strings.TrimSpace(rec.Body.String()); got != "[]" {
		t.Errorf("body = %s, want []", got)
	}
}

func TestUpdateTodoTogglesDone(t *testing.T) {
	router := newTestRouter(t)

	created := decodeTodo(t, doRequest(t, router, http.MethodPost, "/todos", `{"title":"やること"}`))

	path := "/todos/" + itoa(created.ID)
	rec := doRequest(t, router, http.MethodPatch, path, `{"done":true}`)

	if rec.Code != http.StatusOK {
		t.Fatalf("status = %d, want %d (body: %s)", rec.Code, http.StatusOK, rec.Body.String())
	}

	updated := decodeTodo(t, rec)
	if !updated.Done {
		t.Error("done = false, want true")
	}
	if updated.Title != "やること" {
		t.Errorf("title = %q, want it to stay %q", updated.Title, "やること")
	}
}

func TestUpdateTodoWithUnknownIDReturns404(t *testing.T) {
	router := newTestRouter(t)

	rec := doRequest(t, router, http.MethodPatch, "/todos/999", `{"done":true}`)

	if rec.Code != http.StatusNotFound {
		t.Errorf("status = %d, want %d", rec.Code, http.StatusNotFound)
	}
}

func TestUpdateTodoWithInvalidIDReturns400(t *testing.T) {
	router := newTestRouter(t)

	rec := doRequest(t, router, http.MethodPatch, "/todos/abc", `{"done":true}`)

	if rec.Code != http.StatusBadRequest {
		t.Errorf("status = %d, want %d", rec.Code, http.StatusBadRequest)
	}
}

func TestDeleteTodo(t *testing.T) {
	router := newTestRouter(t)

	created := decodeTodo(t, doRequest(t, router, http.MethodPost, "/todos", `{"title":"消す予定"}`))

	rec := doRequest(t, router, http.MethodDelete, "/todos/"+itoa(created.ID), "")
	if rec.Code != http.StatusNoContent {
		t.Fatalf("status = %d, want %d", rec.Code, http.StatusNoContent)
	}

	listRec := doRequest(t, router, http.MethodGet, "/todos", "")
	var todos []model.Todo
	if err := json.NewDecoder(listRec.Body).Decode(&todos); err != nil {
		t.Fatalf("failed to decode list response: %v", err)
	}
	if len(todos) != 0 {
		t.Errorf("len(todos) = %d, want 0 after delete", len(todos))
	}
}

func TestHealthzIsNotRegisteredOnTodoRoutes(t *testing.T) {
	router := newTestRouter(t)

	// /healthz は main.go 側で登録している。ハンドラ単体では未登録であることを確認する。
	rec := doRequest(t, router, http.MethodGet, "/healthz", "")

	if rec.Code != http.StatusNotFound {
		t.Errorf("status = %d, want %d", rec.Code, http.StatusNotFound)
	}
}

func itoa(id int64) string {
	return strconv.FormatInt(id, 10)
}
