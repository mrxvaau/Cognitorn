<?php
session_start();
require_once __DIR__ . '/../model/User.php';

$_SESSION['regError'] = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = htmlspecialchars(trim($_POST['username'] ?? ''));
    $email = htmlspecialchars(trim($_POST['email'] ?? ''));
    $password = $_POST['password'] ?? '';

    if (empty($username) || empty($email) || empty($password)) {
        $_SESSION['regError'] = 'Please fill in all fields';
        $_SESSION['activeModal'] = 'auth';
        $_SESSION['activeTab'] = 'register';
        header('Location: ../view/index.php');
        exit();
    }

    if (strlen($password) < 6) {
        $_SESSION['regError'] = 'Password must be at least 6 characters';
        $_SESSION['activeModal'] = 'auth';
        $_SESSION['activeTab'] = 'register';
        header('Location: ../view/index.php');
        exit();
    }

    if (userExists($username)) {
        $_SESSION['regError'] = 'Username already taken';
        $_SESSION['activeModal'] = 'auth';
        $_SESSION['activeTab'] = 'register';
        header('Location: ../view/index.php');
        exit();
    }

    if (emailExists($email)) {
        $_SESSION['regError'] = 'Email already registered';
        $_SESSION['activeModal'] = 'auth';
        $_SESSION['activeTab'] = 'register';
        header('Location: ../view/index.php');
        exit();
    }

    $user = registerUser($username, $email, $password);
    if ($user) {
        $_SESSION['isLoggedIn'] = true;
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['username'] = $user['username'];
        $_SESSION['avatar'] = $user['avatar'];
        $_SESSION['user'] = $user;
        unset($_SESSION['activeModal']);
        $_SESSION['toast'] = "Account created! Welcome, {$username} 🚀";
        header('Location: ../view/index.php');
        exit();
    } else {
        $_SESSION['regError'] = 'Failed to create account';
        $_SESSION['activeModal'] = 'auth';
        $_SESSION['activeTab'] = 'register';
        header('Location: ../view/index.php');
        exit();
    }
} else {
    header('Location: ../view/index.php');
    exit();
}
