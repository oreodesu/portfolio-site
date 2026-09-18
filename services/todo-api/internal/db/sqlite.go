package db

import (
	"database/sql"
	"fmt"

	_ "modernc.org/sqlite"
)

// New はSQLiteファイルへの接続を開き、必要なテーブルを作成する。
func New(path string) (*sql.DB, error) {
	conn, err := sql.Open("sqlite", path)
	if err != nil {
		return nil, fmt.Errorf("open sqlite: %w", err)
	}

	if err := migrate(conn); err != nil {
		return nil, fmt.Errorf("migrate: %w", err)
	}

	return conn, nil
}

func migrate(conn *sql.DB) error {
	const schema = `
	CREATE TABLE IF NOT EXISTS todos (
		id         INTEGER PRIMARY KEY AUTOINCREMENT,
		title      TEXT NOT NULL,
		done       INTEGER NOT NULL DEFAULT 0,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
	);
	`
	_, err := conn.Exec(schema)
	return err
}
