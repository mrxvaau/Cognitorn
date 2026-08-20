<?php
session_start();
require_once __DIR__ . '/../model/Social.php';

if (!isset($_SESSION['isLoggedIn']) || !$_SESSION['isLoggedIn']) {
    $_SESSION['loginError'] = 'Sign in to install';
    $_SESSION['activeModal'] = 'auth';
    header('Location: ../view/index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $skillId = htmlspecialchars($_POST['skill_id'] ?? '');
    if ($skillId) {
        $installed = recordInstall($_SESSION['user_id'], $skillId);
        if ($installed) {
            $_SESSION['toast'] = '⬇ Installed! Check My Skills';
        } else {
            $_SESSION['toast'] = 'Already installed — check My Skills';
        }
    }
}

$referer = $_SERVER['HTTP_REFERER'] ?? '../view/index.php';
header('Location: ' . $referer);
exit();
