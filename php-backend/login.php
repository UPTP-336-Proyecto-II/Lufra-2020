<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

// Get JSON input
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

try {
    $conn = getDBConnection();

    // Get user with role
    $stmt = $conn->prepare("
        SELECT u.Id_Usuario, u.Nombre_usuario, u.Contraseña, r.Nombre_rol
        FROM usuario u
        JOIN roles r ON u.Id_rol = r.Id_rol
        WHERE u.Nombre_usuario = ?
    ");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(401);
        echo json_encode(['error' => 'Usuario no encontrado']);
        $stmt->close();
        closeDBConnection($conn);
        exit;
    }

    $user = $result->fetch_assoc();
    $stmt->close();

    // Verify password (assuming passwords are hashed with password_hash)
    if (!password_verify($password, $user['Contraseña'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Contraseña incorrecta']);
        closeDBConnection($conn);
        exit;
    }

    // Generate JWT token (simple implementation)
    $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
    $payload = json_encode([
        'id' => $user['Id_Usuario'],
        'username' => $user['Nombre_usuario'],
        'role' => $user['Nombre_rol'],
        'iat' => time(),
        'exp' => time() + (24 * 60 * 60) // 24 hours
    ]);

    $headerEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($header));
    $payloadEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($payload));

    $signature = hash_hmac('sha256', $headerEncoded . "." . $payloadEncoded, 'your-secret-key', true);
    $signatureEncoded = str_replace(['+', '/', '='], ['-', '_', ''], base64_encode($signature));

    $token = $headerEncoded . "." . $payloadEncoded . "." . $signatureEncoded;

    echo json_encode([
        'message' => 'Login exitoso',
        'token' => $token,
        'role' => $user['Nombre_rol']
    ]);

    closeDBConnection($conn);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
