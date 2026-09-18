package repository

import (
	"database/sql"

	"github.com/example/portfolio-site/todo-api/internal/model"
)

type TodoRepository struct {
	db *sql.DB
}

func NewTodoRepository(db *sql.DB) *TodoRepository {
	return &TodoRepository{db: db}
}

func (r *TodoRepository) List() ([]model.Todo, error) {
	rows, err := r.db.Query(`SELECT id, title, done, created_at FROM todos ORDER BY id DESC`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	todos := []model.Todo{}
	for rows.Next() {
		var t model.Todo
		if err := rows.Scan(&t.ID, &t.Title, &t.Done, &t.CreatedAt); err != nil {
			return nil, err
		}
		todos = append(todos, t)
	}
	return todos, rows.Err()
}

func (r *TodoRepository) Create(title string) (model.Todo, error) {
	res, err := r.db.Exec(`INSERT INTO todos (title) VALUES (?)`, title)
	if err != nil {
		return model.Todo{}, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return model.Todo{}, err
	}
	return r.Get(id)
}

func (r *TodoRepository) Get(id int64) (model.Todo, error) {
	var t model.Todo
	err := r.db.QueryRow(`SELECT id, title, done, created_at FROM todos WHERE id = ?`, id).
		Scan(&t.ID, &t.Title, &t.Done, &t.CreatedAt)
	return t, err
}

func (r *TodoRepository) Update(id int64, input model.UpdateTodoInput) (model.Todo, error) {
	current, err := r.Get(id)
	if err != nil {
		return model.Todo{}, err
	}

	if input.Title != nil {
		current.Title = *input.Title
	}
	if input.Done != nil {
		current.Done = *input.Done
	}

	_, err = r.db.Exec(`UPDATE todos SET title = ?, done = ? WHERE id = ?`, current.Title, current.Done, id)
	if err != nil {
		return model.Todo{}, err
	}
	return r.Get(id)
}

func (r *TodoRepository) Delete(id int64) error {
	_, err := r.db.Exec(`DELETE FROM todos WHERE id = ?`, id)
	return err
}
