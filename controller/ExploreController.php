<?php
session_start();
require_once __DIR__ . '/../model/Skill.php';

$type = htmlspecialchars($_GET['type'] ?? 'all');
$agent = htmlspecialchars($_GET['agent'] ?? 'all');
$sort = htmlspecialchars($_GET['sort'] ?? 'newest');
$q = htmlspecialchars($_GET['q'] ?? '');
$page = htmlspecialchars($_GET['page'] ?? 'explore');
$userId = $_SESSION['user_id'] ?? null;

$skills = getFilteredSkills($type, $agent, $sort, $q, $page, $userId);
$stats = getPlatformStats();

// Store query state in session for View rendering
$_SESSION['filter_type'] = $type;
$_SESSION['filter_agent'] = $agent;
$_SESSION['filter_sort'] = $sort;
$_SESSION['search_query'] = $q;
$_SESSION['current_page'] = $page;

require __DIR__ . '/../view/index.php';
