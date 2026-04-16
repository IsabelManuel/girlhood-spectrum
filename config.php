<?php
// ============================================
// GIRLHOOD SPECTRUM - DATABASE CONFIG
// ============================================

session_start();

$host   = 'localhost';
$dbname = 'u518499292_girl_database';
$dbuser = 'u518499292_girl_admin';
$dbpass = 'vaYa3ePA.';

try {
    $pdo = new PDO(
        "mysql:host=$host;dbname=$dbname;charset=utf8mb4",
        $dbuser,
        $dbpass
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE,            PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    // Force UTC so timestamps are consistent regardless of server timezone
    $pdo->exec("SET time_zone = '+00:00'");
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erro de ligação à base de dados']);
    exit;
}

header('Content-Type: application/json; charset=utf-8');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Helper: read JSON body
function getInput(): array {
    return json_decode(file_get_contents('php://input'), true) ?? [];
}

// Helper: get logged-in user ID
function getUserId(): ?int {
    return isset($_SESSION['user_id']) ? (int)$_SESSION['user_id'] : null;
}

// Helper: require auth or respond 401
function requireAuth(): void {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['success' => false, 'error' => 'Não autenticado']);
        exit;
    }
}

// Helper: convert MySQL datetime to ISO 8601 UTC (e.g. "2025-04-16T14:30:00Z")
// This ensures JavaScript parses the timestamp in UTC, avoiding timezone offset errors
function toIso(string $datetime): string {
    return str_replace(' ', 'T', $datetime) . 'Z';
}

// Helper: get user's group id
function getGroupId(PDO $pdo, int $userId): ?int {
    $stmt = $pdo->prepare('
        SELECT g.id FROM groups_table g
        JOIN group_members gm ON g.id = gm.group_id
        WHERE gm.user_id = ? LIMIT 1
    ');
    $stmt->execute([$userId]);
    $row = $stmt->fetch();
    return $row ? (int)$row['id'] : null;
}
