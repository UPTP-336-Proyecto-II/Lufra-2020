<?php
// API para logout compatible con legacy
use Illuminate\Support\Facades\Session;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

Session::start();
Session::flush();

// Laravel destruye la sesión y borra la cookie automáticamente

echo json_encode(['message' => 'Logout exitoso']);
exit;
