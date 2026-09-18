<?php

namespace App\Controller;

use App\Model\Link;

class ShortenController
{
    public function index(): void
    {
        $baseUrl = getenv('SHORTENER_BASE_URL') ?: 'http://localhost/s';
        $links = array_map(function (array $link) use ($baseUrl) {
            $link['short_url'] = rtrim($baseUrl, '/') . '/' . $link['code'];
            return $link;
        }, Link::all());

        $this->json($links);
    }

    public function create(): void
    {
        $body = json_decode(file_get_contents('php://input'), true) ?? [];
        $url = trim($body['url'] ?? '');

        if ($url === '' || filter_var($url, FILTER_VALIDATE_URL) === false) {
            $this->json(['error' => 'valid url is required'], 422);
            return;
        }

        $link = Link::create($url);
        $baseUrl = getenv('SHORTENER_BASE_URL') ?: 'http://localhost/s';
        $link['short_url'] = rtrim($baseUrl, '/') . '/' . $link['code'];

        $this->json($link, 201);
    }

    public function redirect(string $code): void
    {
        $link = Link::findByCode($code);

        if ($link === null) {
            $this->json(['error' => 'not found'], 404);
            return;
        }

        Link::incrementClick($code);
        header('Location: ' . $link['original_url'], true, 302);
    }

    private function json(mixed $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json');
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    }
}
