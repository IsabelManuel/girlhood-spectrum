<?php
require_once '../config.php';

$data     = getInput();
$name     = trim($data['name']     ?? '');
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';

if (!$name || !$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'Preenche todos os campos']);
    exit;
}
if (mb_strlen($name) < 2) {
    echo json_encode(['success' => false, 'error' => 'Nome deve ter pelo menos 2 caracteres']);
    exit;
}
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Email inválido']);
    exit;
}
if (strlen($password) < 8) {
    echo json_encode(['success' => false, 'error' => 'Palavra-passe deve ter pelo menos 8 caracteres']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'error' => 'Este email já está registado']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)');
$stmt->execute([$name, $email, $hash]);
$userId = (int)$pdo->lastInsertId();

$_SESSION['user_id']    = $userId;
$_SESSION['user_name']  = $name;
$_SESSION['user_email'] = $email;

echo json_encode([
    'success' => true,
    'user'    => ['id' => $userId, 'name' => $name, 'email' => $email]
]);
