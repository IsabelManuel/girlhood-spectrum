<?php
require_once '../config.php';
requireAuth();

$userId = getUserId();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Save mood
    $data      = getInput();
    $mood      = $data['mood']      ?? '';
    $intensity = (int)($data['intensity'] ?? 5);
    $notes     = $data['notes']     ?? '';

    $valid = ['happy', 'neutral', 'sad', 'anxious', 'angry', 'fear'];
    if (!in_array($mood, $valid, true)) {
        echo json_encode(['success' => false, 'error' => 'Humor inválido']);
        exit;
    }
    $intensity = max(1, min(10, $intensity));

    $stmt = $pdo->prepare('INSERT INTO moods (user_id, mood, intensity, notes) VALUES (?, ?, ?, ?)');
    $stmt->execute([$userId, $mood, $intensity, $notes]);

    echo json_encode(['success' => true, 'id' => (int)$pdo->lastInsertId()]);

} else {
    // GET mood history
    $days = (int)($_GET['days'] ?? 365);
    $days = max(1, min(365, $days));

    $stmt = $pdo->prepare('
        SELECT id, mood, intensity, notes, created_at AS timestamp
        FROM moods
        WHERE user_id = ?
          AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
        ORDER BY created_at ASC
    ');
    $stmt->execute([$userId, $days]);
    $moods = $stmt->fetchAll();
    foreach ($moods as &$m) {
        $m['timestamp'] = toIso($m['timestamp']);
    }

    echo json_encode(['success' => true, 'moods' => $moods]);
}
