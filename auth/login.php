<?php
require_once '../config.php';

$data     = getInput();
$email    = trim($data['email']    ?? '');
$password =      $data['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'error' => 'Preenche todos os campos']);
    exit;
}

$stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch();

if (!$user) {
    echo json_encode(['success' => false, 'error' => 'Email não encontrado']);
    exit;
}
if (!password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'error' => 'Palavra-passe incorreta']);
    exit;
}

$_SESSION['user_id']    = (int)$user['id'];
$_SESSION['user_name']  = $user['name'];
$_SESSION['user_email'] = $user['email'];

echo json_encode([
    'success' => true,
    'user'    => ['id' => (int)$user['id'], 'name' => $user['name'], 'email' => $user['email']]
]);
