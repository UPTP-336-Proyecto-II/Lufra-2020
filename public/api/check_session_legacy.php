<?php
// API para verificar sesión (compatible con legacy)
use Illuminate\Support\Facades\Session;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

Session::start();

if (!Session::has('username')) {
    http_response_code(401);
    echo json_encode(['error' => 'No authenticated']);
    exit;
}

echo json_encode([
    'username' => Session::get('username'),
    'role' => Session::get('role'),
    'id' => Session::get('id')
]);
exit;
