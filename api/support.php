<?php
require_once '../config.php';
requireAuth();

$userId = getUserId();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = getInput();
    $action = $data['action'] ?? 'send';

    if ($action === 'send') {
        $receiverId = (int)($data['receiver_id'] ?? 0);

        if (!$receiverId || $receiverId === $userId) {
            echo json_encode(['success' => false, 'error' => 'Destinatário inválido']);
            exit;
        }

        // Verify both users are in the same group
        $groupId = getGroupId($pdo, $userId);
        if (!$groupId) {
            echo json_encode(['success' => false, 'error' => 'Sem grupo']);
            exit;
        }

        $stmt = $pdo->prepare('INSERT INTO support_notifications (sender_id, receiver_id) VALUES (?, ?)');
        $stmt->execute([$userId, $receiverId]);

        echo json_encode(['success' => true]);

    } elseif ($action === 'mark_read') {
        $stmt = $pdo->prepare('UPDATE support_notifications SET is_read = 1 WHERE receiver_id = ?');
        $stmt->execute([$userId]);
        echo json_encode(['success' => true]);

    } else {
        echo json_encode(['success' => false, 'error' => 'Ação inválida']);
    }

} else {
    // GET — return support notifications received by current user
    $stmt = $pdo->prepare('
        SELECT sn.id, sn.is_read, sn.created_at AS timestamp,
               u.name AS sender_name
        FROM support_notifications sn
        JOIN users u ON sn.sender_id = u.id
        WHERE sn.receiver_id = ?
        ORDER BY sn.created_at DESC
        LIMIT 20
    ');
    $stmt->execute([$userId]);
    $notifications = $stmt->fetchAll();

    foreach ($notifications as &$n) {
        $n['timestamp'] = toIso($n['timestamp']);
        $n['is_read']   = (int)$n['is_read'];
    }
    unset($n);

    $unreadCount = count(array_filter($notifications, fn($n) => $n['is_read'] === 0));

    echo json_encode([
        'success'       => true,
        'notifications' => $notifications,
        'unread_count'  => $unreadCount
    ]);
}
