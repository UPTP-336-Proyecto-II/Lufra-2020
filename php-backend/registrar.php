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

if (!$input || !isset($input['name']) || !isset($input['email']) || !isset($input['username']) || !isset($input['password']) || !isset($input['role'])) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields are required']);
    exit;
}

$name = trim($input['name']);
$email = trim($input['email']);
$username = trim($input['username']);
$password = $input['password'];
$role = $input['role'];

if (empty($name) || empty($email) || empty($username) || empty($password) || empty($role)) {
    http_response_code(400);
    echo json_encode(['error' => 'All fields cannot be empty']);
    exit;
}

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid email format']);
    exit;
}

// Validate password strength
if (strlen($password) < 8 || !preg_match('/[a-z]/', $password) || !preg_match('/[A-Z]/', $password) || !preg_match('/[0-9]/', $password) || !preg_match('/[!@#$%^&*]/', $password)) {
    http_response_code(400);
    echo json_encode(['error' => 'Password does not meet requirements']);
    exit;
}

try {
    $conn = getDBConnection();

    // Check if user or email already exists
    $stmt = $conn->prepare("SELECT Id_Usuario FROM usuario WHERE Nombre_usuario = ? OR Correo = ?");
    $stmt->bind_param("ss", $username, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Username or email already exists']);
        $stmt->close();
        closeDBConnection($conn);
        exit;
    }
    $stmt->close();

    // Get role ID
    $stmt = $conn->prepare("SELECT Id_rol FROM roles WHERE Nombre_rol = ?");
    $stmt->bind_param("s", $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid role']);
        $stmt->close();
        closeDBConnection($conn);
        exit;
    }

    $roleData = $result->fetch_assoc();
    $roleId = $roleData['Id_rol'];
    $stmt->close();

    // Hash password
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insert new user
    $stmt = $conn->prepare("INSERT INTO usuario (Id_rol, Nombre_usuario, Correo, Contraseña) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $roleId, $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        echo json_encode(['message' => 'Usuario registrado exitosamente']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Error registering user']);
    }

    $stmt->close();
    closeDBConnection($conn);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
