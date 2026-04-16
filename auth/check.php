<?php
require_once '../config.php';

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'loggedIn' => true,
        'user'     => [
            'id'    => (int)$_SESSION['user_id'],
            'name'  => $_SESSION['user_name'],
            'email' => $_SESSION['user_email']
        ]
    ]);
} else {
    echo json_encode(['loggedIn' => false]);
}
