<?php
require_once __DIR__ . '/../db/connect.php';

function loginUser(string $username, string $password) {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, email, password_hash, avatar, created_at FROM users WHERE username = ?');
    $stmt->execute([$username]);
    $user = $stmt->fetch();

    if ($user && password_verify($password, $user['password_hash'])) {
        unset($user['password_hash']);
        return $user;
    }
    return false;
}

function userExists(string $username): bool {
    $db = getDB();
    $stmt = $db->prepare('SELECT 1 FROM users WHERE username = ?');
    $stmt->execute([$username]);
    return (bool) $stmt->fetchColumn();
}

function emailExists(string $email): bool {
    $db = getDB();
    $stmt = $db->prepare('SELECT 1 FROM users WHERE email = ?');
    $stmt->execute([$email]);
    return (bool) $stmt->fetchColumn();
}

function registerUser(string $username, string $email, string $password) {
    if (userExists($username) || emailExists($email)) {
        return false;
    }
    $db = getDB();
    $id = generateId('u');
    $avatar = strtoupper(substr($username, 0, 2));
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $now = time();

    $stmt = $db->prepare('INSERT INTO users (id, username, email, password_hash, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?)');
    $stmt->execute([$id, $username, $email, $hash, $avatar, $now]);

    return [
        'id' => $id,
        'username' => $username,
        'email' => $email,
        'avatar' => $avatar,
        'created_at' => $now
    ];
}

function getUserById(string $id) {
    $db = getDB();
    $stmt = $db->prepare('SELECT id, username, email, avatar, created_at FROM users WHERE id = ?');
    $stmt->execute([$id]);
    return $stmt->fetch() ?: null;
}
