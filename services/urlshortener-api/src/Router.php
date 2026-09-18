<?php

namespace App;

use App\Controller\ShortenController;

class Router
{
    public static function dispatch(string $method, string $path): void
    {
        $controller = new ShortenController();

        if ($path === '/healthz' && $method === 'GET') {
            header('Content-Type: application/json');
            echo json_encode(['status' => 'ok']);
            return;
        }

        if ($path === '/links' && $method === 'GET') {
            $controller->index();
            return;
        }

        if ($path === '/links' && $method === 'POST') {
            $controller->create();
            return;
        }

        if (preg_match('#^/s/([A-Za-z0-9]+)$#', $path, $matches) && $method === 'GET') {
            $controller->redirect($matches[1]);
            return;
        }

        http_response_code(404);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'not found']);
    }
}
