<?php

namespace App\Model;

use App\Database;
use PDO;

class Link
{
    public static function create(string $originalUrl): array
    {
        $pdo = Database::connection();
        $code = self::generateUniqueCode($pdo);

        $stmt = $pdo->prepare('INSERT INTO links (code, original_url) VALUES (:code, :url)');
        $stmt->execute(['code' => $code, 'url' => $originalUrl]);

        return self::findByCode($code);
    }

    public static function all(): array
    {
        $stmt = Database::connection()->query('SELECT * FROM links ORDER BY id DESC');
        return $stmt->fetchAll();
    }

    public static function findByCode(string $code): ?array
    {
        $stmt = Database::connection()->prepare('SELECT * FROM links WHERE code = :code');
        $stmt->execute(['code' => $code]);
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public static function incrementClick(string $code): void
    {
        $stmt = Database::connection()->prepare('UPDATE links SET click_count = click_count + 1 WHERE code = :code');
        $stmt->execute(['code' => $code]);
    }

    private static function generateUniqueCode(PDO $pdo): string
    {
        do {
            $code = substr(bin2hex(random_bytes(4)), 0, 6);
            $stmt = $pdo->prepare('SELECT COUNT(*) FROM links WHERE code = :code');
            $stmt->execute(['code' => $code]);
            $exists = (int) $stmt->fetchColumn() > 0;
        } while ($exists);

        return $code;
    }
}
