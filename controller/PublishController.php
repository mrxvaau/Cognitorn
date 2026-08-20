<?php
session_start();
require_once __DIR__ . '/../model/Skill.php';

$_SESSION['pubError'] = '';

if (!isset($_SESSION['isLoggedIn']) || !$_SESSION['isLoggedIn']) {
    $_SESSION['loginError'] = 'Sign in to publish';
    $_SESSION['activeModal'] = 'auth';
    header('Location: ../view/index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = htmlspecialchars(trim($_POST['name'] ?? ''));
    $description = htmlspecialchars(trim($_POST['description'] ?? ''));
    $type = htmlspecialchars($_POST['type'] ?? 'skill');
    $agent = htmlspecialchars($_POST['agent'] ?? 'claude');
    $tagsRaw = htmlspecialchars($_POST['tags'] ?? '');
    $version = htmlspecialchars(trim($_POST['version'] ?? '1.0.0'));
    $content = trim($_POST['content'] ?? '');

    if (empty($name)) {
        $_SESSION['pubError'] = 'Name is required';
        $_SESSION['activeModal'] = 'publish';
        header('Location: ../view/index.php');
        exit();
    }
    if (empty($description)) {
        $_SESSION['pubError'] = 'Description is required';
        $_SESSION['activeModal'] = 'publish';
        header('Location: ../view/index.php');
        exit();
    }
    if (empty($content)) {
        $_SESSION['pubError'] = 'Skill content is required';
        $_SESSION['activeModal'] = 'publish';
        header('Location: ../view/index.php');
        exit();
    }

    $tags = array_values(array_filter(array_map('trim', explode(',', $tagsRaw))));

    try {
        $skill = createSkill([
            'author_id' => $_SESSION['user_id'],
            'name' => $name,
            'description' => $description,
            'content' => $content,
            'type' => $type,
            'agent' => $agent,
            'tags' => $tags,
            'version' => $version ?: '1.0.0'
        ]);

        unset($_SESSION['activeModal']);
        $_SESSION['toast'] = "\"{$name}\" published successfully! 🎉";
        header('Location: ../view/index.php');
        exit();
    } catch (Exception $e) {
        $_SESSION['pubError'] = 'Failed to publish skill: ' . $e->getMessage();
        $_SESSION['activeModal'] = 'publish';
        header('Location: ../view/index.php');
        exit();
    }
} else {
    header('Location: ../view/index.php');
    exit();
}
