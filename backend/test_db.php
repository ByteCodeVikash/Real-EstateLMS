<?php
/**
 * Standalone Database Diagnostics & Seeding Utility
 * Secure access required: visit http://yourdomain.com/backend/test_db.php?key=debug123
 */
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Basic Security Check
$securityKey = 'debug123';
if (!isset($_GET['key']) || $_GET['key'] !== $securityKey) {
    http_response_code(403);
    echo "<!DOCTYPE html>
    <html>
    <head><title>Access Denied</title><style>body{font-family:sans-serif;background:#0f0f11;color:#f87171;text-align:center;padding:100px;}</style></head>
    <body>
        <h1>Access Forbidden</h1>
        <p>You must provide the correct security key in the URL. Example:</p>
        <code>test_db.php?key=debug123</code>
    </body>
    </html>";
    exit;
}

define('SECURE_ENTRY', true);
require_once __DIR__ . '/config/config.php';

echo "<!DOCTYPE html>
<html>
<head>
    <title>LMS Database Diagnostics</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f0f11; color: #e4e4e7; padding: 40px; max-width: 800px; margin: 0 auto; }
        h1 { color: #CFAE5D; border-bottom: 1px solid #27272a; padding-bottom: 10px; }
        .card { background: #18181b; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .success { color: #4ade80; font-weight: bold; }
        .danger { color: #f87171; font-weight: bold; }
        .warning { color: #facc15; font-weight: bold; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { text-align: left; padding: 8px; border-bottom: 1px solid #27272a; }
        th { color: #a1a1aa; }
        pre { background: #09090b; padding: 12px; border-radius: 6px; overflow-x: auto; color: #f4f4f5; border: 1px solid #27272a; max-height: 400px; }
        .btn { background: #D4AF37; color: #000; padding: 10px 20px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; }
        .btn:hover { background: #E5C76B; }
    </style>
</head>
<body>
    <h1>LMS Database Diagnostics</h1>
";

echo "<div class='card'>
    <h3>Current Configuration</h3>
    <table>
        <tr><th>Parameter</th><th>Value</th></tr>
        <tr><td>APP_ENV</td><td>" . APP_ENV . "</td></tr>
        <tr><td>DB_HOST</td><td>" . DB_HOST . "</td></tr>
        <tr><td>DB_NAME</td><td>" . DB_NAME . "</td></tr>
        <tr><td>DB_USER</td><td>" . DB_USER . "</td></tr>
        <tr><td>DB_PORT</td><td>" . DB_PORT . "</td></tr>
    </table>
</div>";

try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];

    $connected = false;
    $usedPass = DB_PASS;
    $db = null;

    try {
        $db = new PDO($dsn, DB_USER, DB_PASS, $options);
        $connected = true;
    } catch (PDOException $e) {
        // Try fallback password
        $fallbackPass = (DB_PASS === 'BJReality_LMS_2026!') ? 'BGRealty_LMS_2026!' : 'BJReality_LMS_2026!';
        try {
            $db = new PDO($dsn, DB_USER, $fallbackPass, $options);
            $connected = true;
            $usedPass = $fallbackPass;
        } catch (PDOException $e2) {
            // Both failed
            echo "<div class='card'>
                <h3 class='danger'>❌ Connection Failed!</h3>
                <p>Could not connect to the database with either primary or fallback password.</p>
                <p><strong>Primary Password Error:</strong> " . htmlspecialchars($e->getMessage()) . "</p>
                <p><strong>Fallback Password Error:</strong> " . htmlspecialchars($e2->getMessage()) . "</p>
                <p class='warning'>⚠️ Please double check your database credentials in <code>backend/config/config.php</code> and ensure the user has full permissions to the database in your Hostinger Control Panel.</p>
            </div>";
        }
    }

    if ($connected && $db) {
        echo "<div class='card'>
            <h3 class='success'>✅ Connection Successful!</h3>
            <p>Connected using password: <code>" . htmlspecialchars($usedPass) . "</code></p>
        </div>";

        // Check if user clicked run seeding
        if (isset($_GET['action']) && $_GET['action'] === 'run_seeding') {
            echo "<div class='card'>
                <h3>Running Database Seeding (update_db.php)...</h3>
                <pre>";
            // Include update_db.php output
            ob_start();
            try {
                include __DIR__ . '/config/update_db.php';
            } catch (Exception $seedEx) {
                echo "Seeding Exception: " . htmlspecialchars($seedEx->getMessage()) . "\n";
            }
            $output = ob_get_clean();
            echo htmlspecialchars($output);
            echo "</pre>
            </div>";
        }

        // List tables
        $stmt = $db->query("SHOW TABLES");
        $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        echo "<div class='card'>
            <h3>Database Tables</h3>";
        if (empty($tables)) {
            echo "<p class='warning'>⚠️ Database is empty! No tables found.</p>";
            echo "<p><a href='?key=debug123&action=run_seeding' class='btn'>Run Database Seeding / Setup</a></p>";
        } else {
            echo "<ul>";
            foreach ($tables as $table) {
                echo "<li>" . htmlspecialchars($table) . "</li>";
            }
            echo "</ul>";

            // Check users table row count
            if (in_array('users', $tables)) {
                $count = $db->query("SELECT COUNT(*) FROM users")->fetchColumn();
                echo "<p><strong>Users Table:</strong> $count record(s) found.</p>";

                if ($count > 0) {
                    $users = $db->query("SELECT id, full_name, email, role, status FROM users LIMIT 15")->fetchAll();
                    echo "<h4>Sample Seeded Users:</h4>";
                    echo "<table>
                        <tr><th>ID</th><th>Name</th><th>Email</th><th>Role</th><th>Status</th></tr>";
                    foreach ($users as $u) {
                        echo "<tr>
                            <td>{$u['id']}</td>
                            <td>" . htmlspecialchars($u['full_name']) . "</td>
                            <td>" . htmlspecialchars($u['email']) . "</td>
                            <td>" . htmlspecialchars($u['role']) . "</td>
                            <td>" . htmlspecialchars($u['status']) . "</td>
                        </tr>";
                    }
                    echo "</table>";
                } else {
                    echo "<p class='warning'>⚠️ Users table exists but is empty.</p>";
                }
            } else {
                echo "<p class='danger'>❌ 'users' table is missing!</p>";
            }
            echo "<p style='margin-top: 20px;'><a href='?key=debug123&action=run_seeding' class='btn'>Re-Run Seeding (Safe & Destructive tables refreshed)</a></p>";
        }
        echo "</div>";
    }

} catch (Exception $ex) {
    echo "<div class='card'>
        <h3 class='danger'>❌ Unexpected Error</h3>
        <p>" . htmlspecialchars($ex->getMessage()) . "</p>
    </div>";
}

echo "</body>
</html>";
