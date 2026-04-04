<?php
// API de login compatible con el sistema legacy

require __DIR__.'/../../vendor/autoload.php';
$app = require_once __DIR__.'/../../bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input || !isset($input['username']) || !isset($input['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password are required']);
    exit;
}

$username = trim($input['username']);
$password = $input['password'];

if (empty($username) || empty($password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Username and password cannot be empty']);
    exit;
}

// Consulta a la tabla legacy (usuario, roles)
$user = DB::table('usuario')
    ->join('roles', 'usuario.Id_rol', '=', 'roles.Id_rol')
    ->where('usuario.Nombre_usuario', $username)
    ->select('usuario.*', 'roles.Nombre_rol')
    ->first();

if (!$user) {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario no encontrado']);
    exit;
}

if (isset($user->Estado) && $user->Estado === 'Inactivo') {
    http_response_code(401);
    echo json_encode(['error' => 'Usuario inactivo. Contacte al administrador.']);
    exit;
}

if (!Hash::check($password, $user->Contraseña)) {
    http_response_code(401);
    echo json_encode(['error' => 'Contraseña incorrecta']);
    exit;
}

Session::put('id', $user->Id_Usuario);
Session::put('username', $user->Nombre_usuario);
Session::put('role', $user->Nombre_rol);
Session::put('iat', time());

echo json_encode([
    'message' => 'Login exitoso',
    'role' => $user->Nombre_rol
]);
exit;
