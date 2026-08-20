<?php
require_once __DIR__ . '/../db/connect.php';
require_once __DIR__ . '/User.php';

function buildSkillObject(array $row, ?string $userId = null): array {
    $db = getDB();
    $tags = json_decode($row['tags'] ?? '[]', true) ?: [];
    $author = getUserById($row['author_id']);

    // Collaborators
    $cStmt = $db->prepare('SELECT u.id, u.username, u.avatar FROM collaborators c JOIN users u ON c.user_id = u.id WHERE c.skill_id = ?');
    $cStmt->execute([$row['id']]);
    $collaborators = $cStmt->fetchAll();

    // Versions
    $vStmt = $db->prepare('SELECT id, version, note, content, created_at FROM skill_versions WHERE skill_id = ? ORDER BY created_at ASC');
    $vStmt->execute([$row['id']]);
    $versions = $vStmt->fetchAll();

    // User social checks
    $isStarred = false;
    $isInstalled = false;
    if ($userId) {
        $stStmt = $db->prepare('SELECT 1 FROM stars WHERE user_id = ? AND skill_id = ?');
        $stStmt->execute([$userId, $row['id']]);
        $isStarred = (bool) $stStmt->fetchColumn();

        $inStmt = $db->prepare('SELECT 1 FROM installs WHERE user_id = ? AND skill_id = ?');
        $inStmt->execute([$userId, $row['id']]);
        $isInstalled = (bool) $inStmt->fetchColumn();
    }

    return [
        'id' => $row['id'],
        'author_id' => $row['author_id'],
        'author' => $author ?: ['id' => $row['author_id'], 'username' => 'unknown', 'avatar' => '??'],
        'name' => $row['name'],
        'description' => $row['description'],
        'content' => $row['content'],
        'type' => $row['type'],
        'agent' => $row['agent'],
        'tags' => $tags,
        'version' => $row['version'],
        'stars' => (int) $row['stars_count'],
        'installs' => (int) $row['installs_count'],
        'forks' => (int) $row['forks_count'],
        'forked_from' => $row['forked_from'],
        'collaborators' => $collaborators,
        'versions' => $versions,
        'is_starred' => $isStarred,
        'is_installed' => $isInstalled,
        'created_at' => (int) $row['created_at'],
        'updated_at' => (int) $row['updated_at'],
    ];
}

function getFilteredSkills(string $type = 'all', string $agent = 'all', string $sort = 'newest', string $q = '', string $page = 'explore', ?string $userId = null): array {
    $db = getDB();
    $sql = 'SELECT * FROM skills WHERE 1=1';
    $params = [];

    if ($page === 'mcp') {
        $sql .= ' AND type = "mcp"';
    } elseif ($page === 'agents') {
        $sql .= ' AND type = "agent"';
    } elseif ($page === 'myskills' && $userId) {
        $sql .= ' AND (author_id = ? OR id IN (SELECT skill_id FROM collaborators WHERE user_id = ?))';
        $params[] = $userId;
        $params[] = $userId;
    }

    if ($type !== 'all' && $page === 'explore') {
        $sql .= ' AND type = ?';
        $params[] = $type;
    }

    if ($agent !== 'all') {
        $sql .= ' AND (agent = ? OR agent = "any")';
        $params[] = $agent;
    }

    if (!empty($q)) {
        $sql .= ' AND (LOWER(name) LIKE ? OR LOWER(description) LIKE ? OR LOWER(tags) LIKE ?)';
        $searchTerm = '%' . strtolower($q) . '%';
        $params[] = $searchTerm;
        $params[] = $searchTerm;
        $params[] = $searchTerm;
    }

    if ($page === 'trending') {
        $sql .= ' ORDER BY (stars_count + installs_count) DESC LIMIT 12';
    } else {
        if ($sort === 'stars') $sql .= ' ORDER BY stars_count DESC';
        elseif ($sort === 'installs') $sql .= ' ORDER BY installs_count DESC';
        elseif ($sort === 'forks') $sql .= ' ORDER BY forks_count DESC';
        else $sql .= ' ORDER BY created_at DESC';
    }

    $stmt = $db->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $skills = [];
    foreach ($rows as $row) {
        $skills[] = buildSkillObject($row, $userId);
    }
    return $skills;
}

function getSkillById(string $id, ?string $userId = null): ?array {
    $db = getDB();
    $stmt = $db->prepare('SELECT * FROM skills WHERE id = ?');
    $stmt->execute([$id]);
    $row = $stmt->fetch();
    return $row ? buildSkillObject($row, $userId) : null;
}

function createSkill(array $data): array {
    $db = getDB();
    $id = generateId('s');
    $now = time();
    $tagsJson = json_encode($data['tags'] ?? []);

    $db->beginTransaction();
    try {
        $stmt = $db->prepare('INSERT INTO skills (id, author_id, name, description, content, type, agent, tags, version, stars_count, installs_count, forks_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?)');
        $stmt->execute([
            $id,
            $data['author_id'],
            $data['name'],
            $data['description'],
            $data['content'],
            $data['type'],
            $data['agent'],
            $tagsJson,
            $data['version'] ?? '1.0.0',
            $now,
            $now
        ]);

        $vStmt = $db->prepare('INSERT INTO skill_versions (id, skill_id, version, note, content, created_at) VALUES (?, ?, ?, ?, ?, ?)');
        $vStmt->execute([generateId('v'), $id, $data['version'] ?? '1.0.0', 'Initial release', $data['content'], $now]);

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

    return getSkillById($id, $data['author_id']);
}

function getPlatformStats(): array {
    $db = getDB();
    $skillsCount = (int) $db->query('SELECT COUNT(*) FROM skills')->fetchColumn();
    $usersCount = (int) $db->query('SELECT COUNT(*) FROM users')->fetchColumn();
    $totalInstalls = (int) $db->query('SELECT COALESCE(SUM(installs_count), 0) FROM skills')->fetchColumn();

    return [
        'skills_count' => $skillsCount,
        'users_count' => $usersCount,
        'total_installs' => $totalInstalls
    ];
}
