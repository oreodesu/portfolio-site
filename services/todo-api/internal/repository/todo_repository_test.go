package repository

import (
	"path/filepath"
	"testing"

	"github.com/example/portfolio-site/todo-api/internal/db"
	"github.com/example/portfolio-site/todo-api/internal/model"
)

func newTestRepository(t *testing.T) *TodoRepository {
	t.Helper()

	conn, err := db.New(filepath.Join(t.TempDir(), "todo.db"))
	if err != nil {
		t.Fatalf("failed to open test db: %v", err)
	}
	t.Cleanup(func() {
		if err := conn.Close(); err != nil {
			t.Errorf("failed to close test db: %v", err)
		}
	})

	return NewTodoRepository(conn)
}

func TestCreateStoresTitleAsNotDone(t *testing.T) {
	repo := newTestRepository(t)

	created, err := repo.Create("牛乳を買う")
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}

	if created.Title != "牛乳を買う" {
		t.Errorf("title = %q, want %q", created.Title, "牛乳を買う")
	}
	if created.Done {
		t.Error("done = true, want false for a newly created todo")
	}
	if created.ID == 0 {
		t.Error("id was not assigned")
	}
	if created.CreatedAt.IsZero() {
		t.Error("created_at was not assigned")
	}
}

func TestListReturnsNewestFirst(t *testing.T) {
	repo := newTestRepository(t)

	for _, title := range []string{"1つ目", "2つ目", "3つ目"} {
		if _, err := repo.Create(title); err != nil {
			t.Fatalf("Create(%q) returned error: %v", title, err)
		}
	}

	todos, err := repo.List()
	if err != nil {
		t.Fatalf("List returned error: %v", err)
	}

	want := []string{"3つ目", "2つ目", "1つ目"}
	if len(todos) != len(want) {
		t.Fatalf("len(todos) = %d, want %d", len(todos), len(want))
	}
	for i, title := range want {
		if todos[i].Title != title {
			t.Errorf("todos[%d].Title = %q, want %q", i, todos[i].Title, title)
		}
	}
}

func TestListOnEmptyTableReturnsEmptySlice(t *testing.T) {
	repo := newTestRepository(t)

	todos, err := repo.List()
	if err != nil {
		t.Fatalf("List returned error: %v", err)
	}

	// JSONで `null` ではなく `[]` を返したいので、nilではなく空スライスであることを保証する
	if todos == nil {
		t.Fatal("List returned nil, want an empty slice")
	}
	if len(todos) != 0 {
		t.Errorf("len(todos) = %d, want 0", len(todos))
	}
}

func TestUpdateOnlyChangesProvidedFields(t *testing.T) {
	repo := newTestRepository(t)

	created, err := repo.Create("元のタイトル")
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}

	done := true
	updated, err := repo.Update(created.ID, model.UpdateTodoInput{Done: &done})
	if err != nil {
		t.Fatalf("Update returned error: %v", err)
	}

	if !updated.Done {
		t.Error("done = false, want true")
	}
	if updated.Title != "元のタイトル" {
		t.Errorf("title = %q, want it to stay %q when only done is provided", updated.Title, "元のタイトル")
	}

	title := "新しいタイトル"
	updated, err = repo.Update(created.ID, model.UpdateTodoInput{Title: &title})
	if err != nil {
		t.Fatalf("Update returned error: %v", err)
	}

	if updated.Title != title {
		t.Errorf("title = %q, want %q", updated.Title, title)
	}
	if !updated.Done {
		t.Error("done = false, want it to stay true when only title is provided")
	}
}

func TestUpdateUnknownIDReturnsError(t *testing.T) {
	repo := newTestRepository(t)

	title := "存在しないTODO"
	if _, err := repo.Update(999, model.UpdateTodoInput{Title: &title}); err == nil {
		t.Error("Update returned nil error for an unknown id, want an error")
	}
}

func TestDeleteRemovesTodo(t *testing.T) {
	repo := newTestRepository(t)

	created, err := repo.Create("消す予定")
	if err != nil {
		t.Fatalf("Create returned error: %v", err)
	}

	if err := repo.Delete(created.ID); err != nil {
		t.Fatalf("Delete returned error: %v", err)
	}

	if _, err := repo.Get(created.ID); err == nil {
		t.Error("Get returned nil error after delete, want an error")
	}

	todos, err := repo.List()
	if err != nil {
		t.Fatalf("List returned error: %v", err)
	}
	if len(todos) != 0 {
		t.Errorf("len(todos) = %d, want 0 after delete", len(todos))
	}
}
