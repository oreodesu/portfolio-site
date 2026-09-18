<?php

require_once __DIR__ . '/../vendor/autoload.php';

use App\Router;

$path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

Router::dispatch($method, rtrim($path, '/') === '' ? '/' : rtrim($path, '/'));
