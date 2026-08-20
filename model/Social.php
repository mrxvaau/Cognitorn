<?php
require_once __DIR__ . '/../db/connect.php';
require_once __DIR__ . '/Skill.php';

function toggleStar(string $userId, string $skillId): array {
    $db = getDB();
    $db->beginTransaction();
    try {
        $check = $db->prepare('SELECT 1 FROM stars WHERE user_id = ? AND skill_id = ?');
        $check->execute([$userId, $skillId]);
        $exists = (bool) $check->fetchColumn();

        if ($exists) {
            $del = $db->prepare('DELETE FROM stars WHERE user_id = ? AND skill_id = ?');
            $del->execute([$userId, $skillId]);
            $upd = $db->prepare('UPDATE skills SET stars_count = MAX(0, stars_count - 1) WHERE id = ?');
            $upd->execute([$skillId]);
            $starred = false;
        } else {
            $ins = $db->prepare('INSERT INTO stars (user_id, skill_id, created_at) VALUES (?, ?, ?)');
            $ins->execute([$userId, $skillId, time()]);
            $upd = $db->prepare('UPDATE skills SET stars_count = stars_count + 1 WHERE id = ?');
            $upd->execute([$skillId]);
            $starred = true;
        }
        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

    $cStmt = $db->prepare('SELECT stars_count FROM skills WHERE id = ?');
    $cStmt->execute([$skillId]);
    $count = (int) $cStmt->fetchColumn();

    return ['starred' => $starred, 'count' => $count];
}

function forkSkill(string $userId, string $skillId): ?array {
    $db = getDB();
    $orig = getSkillById($skillId);
    if (!$orig || $orig['author_id'] === $userId) {
        return null; // Cannot fork missing or own skill
    }

    // Check if already forked
    $check = $db->prepare('SELECT 1 FROM forks WHERE user_id = ? AND skill_id = ?');
    $check->execute([$userId, $skillId]);
    if ($check->fetchColumn()) {
        return null;
    }

    $newId = generateId('s');
    $now = time();

    $db->beginTransaction();
    try {
        $ins = $db->prepare('INSERT INTO skills (id, author_id, name, description, content, type, agent, tags, version, stars_count, installs_count, forks_count, forked_from, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, 0, ?, ?, ?)');
        $ins->execute([
            $newId,
            $userId,
            $orig['name'] . ' (fork)',
            $orig['description'],
            $orig['content'],
            $orig['type'],
            $orig['agent'],
            json_encode($orig['tags']),
            $orig['version'],
            $skillId,
            $now,
            $now
        ]);

        $fIns = $db->prepare('INSERT INTO forks (user_id, skill_id, created_at) VALUES (?, ?, ?)');
        $fIns->execute([$userId, $skillId, $now]);

        $upd = $db->prepare('UPDATE skills SET forks_count = forks_count + 1 WHERE id = ?');
        $upd->execute([$skillId]);

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

    return getSkillById($newId, $userId);
}

function recordInstall(string $userId, string $skillId): bool {
    $db = getDB();
    $check = $db->prepare('SELECT 1 FROM installs WHERE user_id = ? AND skill_id = ?');
    $check->execute([$userId, $skillId]);
    if ($check->fetchColumn()) {
        return false; // Already installed
    }

    $db->beginTransaction();
    try {
        $ins = $db->prepare('INSERT INTO installs (user_id, skill_id, installed_at) VALUES (?, ?, ?)');
        $ins->execute([$userId, $skillId, time()]);

        $upd = $db->prepare('UPDATE skills SET installs_count = installs_count + 1 WHERE id = ?');
        $upd->execute([$skillId]);

        $db->commit();
    } catch (Exception $e) {
        $db->rollBack();
        throw $e;
    }

    return true;
}
