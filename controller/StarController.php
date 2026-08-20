<?php
session_start();
require_once __DIR__ . '/../model/Social.php';

if (!isset($_SESSION['isLoggedIn']) || !$_SESSION['isLoggedIn']) {
    $_SESSION['loginError'] = 'Sign in to star';
    $_SESSION['activeModal'] = 'auth';
    header('Location: ../view/index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $skillId = htmlspecialchars($_POST['skill_id'] ?? '');
    if ($skillId) {
        $res = toggleStar($_SESSION['user_id'], $skillId);
        $_SESSION['toast'] = $res['starred'] ? '⭐ Starred!' : 'Unstarred';
    }
}

$referer = $_SERVER['HTTP_REFERER'] ?? '../view/index.php';
header('Location: ' . $referer);
exit();
