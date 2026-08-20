<?php
session_start();
require_once __DIR__ . '/../model/Social.php';

if (!isset($_SESSION['isLoggedIn']) || !$_SESSION['isLoggedIn']) {
    $_SESSION['loginError'] = 'Sign in to fork';
    $_SESSION['activeModal'] = 'auth';
    header('Location: ../view/index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $skillId = htmlspecialchars($_POST['skill_id'] ?? '');
    if ($skillId) {
        $forked = forkSkill($_SESSION['user_id'], $skillId);
        if ($forked) {
            $_SESSION['toast'] = "⑂ Forked \"{$forked['name']}\" to your profile!";
        } else {
            $_SESSION['toast'] = 'Could not fork skill (already forked or own skill)';
        }
    }
}

$referer = $_SERVER['HTTP_REFERER'] ?? '../view/index.php';
header('Location: ' . $referer);
exit();
