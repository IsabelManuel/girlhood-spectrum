<?php
require_once '../config.php';
requireAuth();

$userId  = getUserId();
$groupId = getGroupId($pdo, $userId);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data   = getInput();
    $action = $data['action'] ?? 'create';

    if ($action === 'create') {
        if (!$groupId) {
            echo json_encode(['success' => false, 'error' => 'Sem grupo']);
            exit;
        }
        $stmt = $pdo->prepare('INSERT INTO fear_alerts (sender_id, group_id) VALUES (?, ?)');
        $stmt->execute([$userId, $groupId]);
        $alertId = (int)$pdo->lastInsertId();

        // Sender already "read" own alert
        $stmt = $pdo->prepare('INSERT IGNORE INTO fear_alert_reads (alert_id, user_id) VALUES (?, ?)');
        $stmt->execute([$alertId, $userId]);

        echo json_encode(['success' => true]);

    } elseif ($action === 'dismiss') {
        if (!$groupId) {
            echo json_encode(['success' => true]);
            exit;
        }
        // Get unread alerts for this user in their group
        $stmt = $pdo->prepare('
            SELECT fa.id FROM fear_alerts fa
            WHERE fa.group_id  = ?
              AND fa.sender_id != ?
              AND fa.id NOT IN (
                SELECT alert_id FROM fear_alert_reads WHERE user_id = ?
              )
        ');
        $stmt->execute([$groupId, $userId, $userId]);
        $unread = $stmt->fetchAll();

        $insert = $pdo->prepare('INSERT IGNORE INTO fear_alert_reads (alert_id, user_id) VALUES (?, ?)');
        foreach ($unread as $alert) {
            $insert->execute([$alert['id'], $userId]);
        }
        echo json_encode(['success' => true]);

    } else {
        echo json_encode(['success' => false, 'error' => 'Ação inválida']);
    }

} else {
    // GET — return all fear alerts from group + unread list
    if (!$groupId) {
        echo json_encode(['success' => true, 'alerts' => [], 'unread' => [], 'unread_count' => 0]);
        exit;
    }

    $stmt = $pdo->prepare('
        SELECT fa.id, fa.created_at AS timestamp,
               u.name AS sender_name, u.email AS sender_email,
               IF(far.id IS NULL, 1, 0) AS is_unread
        FROM fear_alerts fa
        JOIN users u ON fa.sender_id = u.id
        LEFT JOIN fear_alert_reads far
               ON far.alert_id = fa.id AND far.user_id = ?
        WHERE fa.group_id  = ?
          AND fa.sender_id != ?
        ORDER BY fa.created_at DESC
    ');
    $stmt->execute([$userId, $groupId, $userId]);
    $allAlerts = $stmt->fetchAll();

    $unread = array_values(array_filter($allAlerts, fn($a) => (int)$a['is_unread'] === 1));

    echo json_encode([
        'success'      => true,
        'alerts'       => $allAlerts,
        'unread'       => $unread,
        'unread_count' => count($unread)
    ]);
}
