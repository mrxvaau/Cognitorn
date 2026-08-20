<?php
session_start();
require_once __DIR__ . '/../model/User.php';

$_SESSION['loginError'] = '';
$_SESSION['loginUsername'] = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = htmlspecialchars(trim($_POST['username'] ?? ''));
    $password = $_POST['password'] ?? '';

    $flag = true;
    if (empty($username) || empty($password)) {
        $flag = false;
        $_SESSION['loginError'] = 'Please fill in all fields';
    }

    if ($flag) {
        $user = loginUser($username, $password);
        if ($user) {
            $_SESSION['isLoggedIn'] = true;
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['avatar'] = $user['avatar'];
            $_SESSION['user'] = $user;
            unset($_SESSION['activeModal']);
            header('Location: ../view/index.php');
            exit();
        } else {
            $_SESSION['loginError'] = 'Invalid username or password';
            $_SESSION['loginUsername'] = $username;
            $_SESSION['activeModal'] = 'auth';
            header('Location: ../view/index.php');
            exit();
        }
    } else {
        $_SESSION['loginUsername'] = $username;
        $_SESSION['activeModal'] = 'auth';
        header('Location: ../view/index.php');
        exit();
    }
} else {
    header('Location: ../view/index.php');
    exit();
}
