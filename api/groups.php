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

function fetchGroupMembers(PDO $pdo, int $groupId): array {
    $stmt = $pdo->prepare('
        SELECT u.id, u.name, u.email, gm.joined_at,
               IF(g.creator_id = u.id, 1, 0) AS is_creator
        FROM group_members gm
        JOIN users u        ON gm.user_id  = u.id
        JOIN groups_table g ON gm.group_id = g.id
        WHERE gm.group_id = ?
    ');
    $stmt->execute([$groupId]);
    return $stmt->fetchAll();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Return ALL groups the user belongs to
    $stmt = $pdo->prepare('
        SELECT g.*, IF(g.creator_id = ?, 1, 0) AS is_owner
        FROM groups_table g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ?
        ORDER BY gm.joined_at ASC
    ');
    $stmt->execute([$userId, $userId]);
    $groups = $stmt->fetchAll();

    foreach ($groups as &$g) {
        $g['members']  = fetchGroupMembers($pdo, (int)$g['id']);
        $g['is_owner'] = (int)$g['is_owner'];
    }
    unset($g);

    $createdCount = count(array_filter($groups, fn($g) => $g['is_owner'] === 1));

    echo json_encode([
        'success'       => true,
        'groups'        => $groups,
        'created_count' => $createdCount,
        // Backward-compat fields (first group)
        'group'   => $groups[0] ?? null,
        'members' => $groups[0]['members'] ?? []
    ]);

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

        // Limit: max 2 created groups per user
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM groups_table WHERE creator_id = ?');
        $stmt->execute([$userId]);
        $createdCount = (int)$stmt->fetchColumn();

        if ($createdCount >= 2) {
            echo json_encode(['success' => false, 'error' => 'Já criaste o máximo de 2 grupos']);
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

        $stmt = $pdo->prepare('SELECT * FROM groups_table WHERE code = ?');
        $stmt->execute([$code]);
        $group = $stmt->fetch();

        if (!$group) {
            echo json_encode(['success' => false, 'error' => 'Código inválido. Verifica se está correto.']);
            exit;
        }

        // Check if already a member of this specific group
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
