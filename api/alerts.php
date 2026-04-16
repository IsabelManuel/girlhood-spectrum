<?php
require_once '../config.php';
requireAuth();

$userId  = getUserId();
$groupId = getGroupId($pdo, $userId);

if (!$groupId) {
    echo json_encode(['success' => true, 'alerts' => []]);
    exit;
}

$stmt = $pdo->prepare('
    SELECT m.id, m.mood, m.intensity, m.notes, m.created_at AS timestamp,
           u.name AS member_name, u.email AS member_email
    FROM moods m
    JOIN users u          ON m.user_id  = u.id
    JOIN group_members gm ON u.id       = gm.user_id
    WHERE gm.group_id = ?
      AND m.user_id  != ?
      AND m.mood IN (\'sad\', \'fear\', \'anxious\', \'angry\')
    ORDER BY m.created_at DESC
    LIMIT 50
');
$stmt->execute([$groupId, $userId]);
$alerts = $stmt->fetchAll();
foreach ($alerts as &$a) {
    $a['timestamp'] = toIso($a['timestamp']);
}

echo json_encode(['success' => true, 'alerts' => $alerts]);
