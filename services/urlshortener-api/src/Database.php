<?php

namespace App;

use PDO;

class Database
{
    private static ?PDO $connection = null;

    public static function connection(): PDO
    {
        if (self::$connection === null) {
            $host = getenv('DB_HOST') ?: 'db';
            $name = getenv('DB_NAME') ?: 'shortener_db';
            $user = getenv('DB_USER') ?: 'shortener_app';
            $password = getenv('DB_PASSWORD') ?: '';

            $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";
            self::$connection = new PDO($dsn, $user, $password, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            ]);

            self::migrate(self::$connection);
        }

        return self::$connection;
    }

    private static function migrate(PDO $pdo): void
    {
        $pdo->exec(<<<SQL
            CREATE TABLE IF NOT EXISTS links (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(10) NOT NULL UNIQUE,
                original_url TEXT NOT NULL,
                click_count INT NOT NULL DEFAULT 0,
                created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
        SQL);
    }
}
