<?php
require_once '../config.php';

$_SESSION = [];
session_destroy();

echo json_encode(['success' => true]);
