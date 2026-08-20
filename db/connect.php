<?php
define('DB_PATH', __DIR__ . '/cognitorn.db');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dbFileExists = file_exists(DB_PATH);
        $pdo = new PDO('sqlite:' . DB_PATH);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->exec('PRAGMA foreign_keys = ON;');

        if (!$dbFileExists || filesize(DB_PATH) === 0) {
            $schema = file_get_contents(__DIR__ . '/schema.sql');
            $pdo->exec($schema);

            if (file_exists(__DIR__ . '/seed.sql')) {
                $seed = file_get_contents(__DIR__ . '/seed.sql');
                $pdo->exec($seed);
            }
        }
    }
    return $pdo;
}

function generateId(string $prefix): string {
    return $prefix . '_' . bin2hex(random_bytes(8));
}
