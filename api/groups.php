<?php
require_once '../config.php';
requireAuth();

$userId = getUserId();

function generateUniqueCode(PDO $pdo): string {
    $chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    do {
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $chars[random_int(0, strlen($chars) - 1)];
        }
        $stmt = $pdo->prepare('SELECT id FROM groups_table WHERE code = ?');
        $stmt->execute([$code]);
    } while ($stmt->fetch());
    return $code;
}

function fetchUserGroup(PDO $pdo, int $userId): ?array {
    $stmt = $pdo->prepare('
        SELECT g.*
        FROM groups_table g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
        LIMIT 1
    ');
    $stmt->execute([$userId]);
    return $stmt->fetch() ?: null;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $group = fetchUserGroup($pdo, $userId);

    if (!$group) {
        echo json_encode(['success' => true, 'group' => null, 'members' => []]);
        exit;
    }

    $stmt = $pdo->prepare('
        SELECT u.id, u.name, u.email, gm.joined_at,
               IF(g.creator_id = u.id, 1, 0) AS is_creator
        FROM group_members gm
        JOIN users u          ON gm.user_id  = u.id
        JOIN groups_table g   ON gm.group_id = g.id
        WHERE gm.group_id = ?
    ');
    $stmt->execute([$group['id']]);
    $members = $stmt->fetchAll();

    echo json_encode(['success' => true, 'group' => $group, 'members' => $members]);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = getInput();
    $action = $data['action'] ?? '';

    if ($action === 'create') {
        $name        = trim($data['name']        ?? '');
        $description = trim($data['description'] ?? '');

        if (!$name) {
            echo json_encode(['success' => false, 'error' => 'Nome do grupo obrigatório']);
            exit;
        }
        if (fetchUserGroup($pdo, $userId)) {
            echo json_encode(['success' => false, 'error' => 'Já fazes parte de um grupo']);
            exit;
        }

        $code = generateUniqueCode($pdo);

        $stmt = $pdo->prepare('INSERT INTO groups_table (name, description, code, creator_id) VALUES (?, ?, ?, ?)');
        $stmt->execute([$name, $description, $code, $userId]);
        $groupId = (int)$pdo->lastInsertId();

        $stmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
        $stmt->execute([$groupId, $userId]);

        echo json_encode(['success' => true, 'group' => ['id' => $groupId, 'name' => $name, 'code' => $code]]);

    } elseif ($action === 'join') {
        $code = strtoupper(trim($data['code'] ?? ''));

        if (!$code) {
            echo json_encode(['success' => false, 'error' => 'Código obrigatório']);
            exit;
        }
        if (fetchUserGroup($pdo, $userId)) {
            echo json_encode(['success' => false, 'error' => 'Já fazes parte de um grupo. Sai para entrar neste.']);
            exit;
        }

        $stmt = $pdo->prepare('SELECT * FROM groups_table WHERE code = ?');
        $stmt->execute([$code]);
        $group = $stmt->fetch();

        if (!$group) {
            echo json_encode(['success' => false, 'error' => 'Código inválido. Verifica se está correto.']);
            exit;
        }

        // Check if already member
        $stmt = $pdo->prepare('SELECT id FROM group_members WHERE group_id = ? AND user_id = ?');
        $stmt->execute([$group['id'], $userId]);
        if ($stmt->fetch()) {
            echo json_encode(['success' => false, 'error' => 'Já fazes parte deste grupo']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO group_members (group_id, user_id) VALUES (?, ?)');
        $stmt->execute([$group['id'], $userId]);

        echo json_encode(['success' => true, 'group' => $group]);

    } else {
        echo json_encode(['success' => false, 'error' => 'Ação inválida']);
    }
}
