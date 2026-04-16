<?php
require_once '../config.php';
requireAuth();

$userId = getUserId();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare('SELECT id, name, email, created_at FROM users WHERE id = ?');
    $stmt->execute([$userId]);
    $user = $stmt->fetch();

    echo json_encode(['success' => true, 'user' => $user]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = getInput();
    $action = $data['action'] ?? '';

    if ($action === 'change_password') {
        $current = $data['current_password'] ?? '';
        $new     = $data['new_password']     ?? '';

        if (!$current || !$new) {
            echo json_encode(['success' => false, 'error' => 'Preenche todos os campos']);
            exit;
        }
        if (strlen($new) < 8) {
            echo json_encode(['success' => false, 'error' => 'A nova palavra-passe deve ter pelo menos 8 caracteres']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT password FROM users WHERE id = ?');
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if (!password_verify($current, $user['password'])) {
            echo json_encode(['success' => false, 'error' => 'Palavra-passe atual incorreta']);
            exit;
        }

        $hash = password_hash($new, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare('UPDATE users SET password = ? WHERE id = ?');
        $stmt->execute([$hash, $userId]);

        echo json_encode(['success' => true]);

    } else {
        echo json_encode(['success' => false, 'error' => 'Ação inválida']);
    }
}
