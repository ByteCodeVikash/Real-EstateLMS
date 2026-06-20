<?php
/**
 * Database Verification & Integrity Diagnostic Utility
 * Secure access required: visit http://yourdomain.com/backend/verify_database.php?key=debug123
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
        <code>verify_database.php?key=debug123</code>
    </body>
    </html>";
    exit;
}

define('SECURE_ENTRY', true);
require_once __DIR__ . '/config/config.php';

// Expected tables and their critical columns to verify
$expectedSchema = [
    'users' => ['id', 'full_name', 'email', 'password_hash', 'role', 'status', 'google_id', 'avatar_url', 'auth_provider'],
    'admins' => ['id', 'full_name', 'email', 'password_hash', 'status', 'created_at'],
    'roles' => ['id', 'name', 'description'],
    'permissions' => ['id', 'name', 'description'],
    'role_permissions' => ['role_id', 'permission_id'],
    'categories' => ['id', 'name', 'slug', 'description', 'status', 'sort_order'],
    'courses' => ['id', 'category_id', 'title', 'slug', 'mentor_name', 'price', 'status', 'created_by'],
    'course_modules' => ['id', 'course_id', 'title', 'sort_order', 'status'],
    'lectures' => ['id', 'module_id', 'title', 'video_url', 'duration', 'sort_order', 'status'],
    'assignments' => ['id', 'course_id', 'module_id', 'title', 'max_marks', 'status'],
    'assignment_submissions' => ['id', 'assignment_id', 'student_id', 'status'],
    'enrollments' => ['id', 'user_id', 'course_id', 'status', 'enrolled_at', 'completed_at', 'progress', 'created_at', 'updated_at', 'completion_status', 'enrollment_date', 'certificate_issued', 'order_id', 'payment_status'],
    'webinars' => ['id', 'title', 'meeting_id', 'recording_url', 'status'],
    'certificates' => ['id', 'user_id', 'course_id', 'certificate_code', 'certificate_number', 'issued_at'],
    'notifications' => ['id', 'user_id', 'title', 'message', 'is_read'],
    'announcements' => ['id', 'title', 'content', 'created_by', 'created_at'],
    'course_resources' => ['id', 'course_id', 'title', 'file_path'],
    'lecture_progress' => ['id', 'user_id', 'lecture_id', 'is_completed']
];

?>
<!DOCTYPE html>
<html>
<head>
    <title>LMS Database Integrity Check</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0c0c0e; color: #e4e4e7; padding: 30px; max-width: 1000px; margin: 0 auto; }
        h1 { color: #CFAE5D; border-bottom: 1px solid #27272a; padding-bottom: 10px; margin-bottom: 25px; }
        .summary-card { background: #141416; border: 1px solid #27272a; border-radius: 12px; padding: 25px; margin-bottom: 25px; display: flex; align-items: center; justify-content: space-between; }
        .summary-title { font-size: 1.5rem; font-weight: bold; margin-bottom: 5px; }
        .summary-desc { color: #a1a1aa; font-size: 0.9rem; }
        .badge { padding: 8px 16px; border-radius: 20px; font-weight: bold; font-size: 0.9rem; text-transform: uppercase; }
        .badge.perfect { background: rgba(74, 222, 128, 0.15); color: #4ade80; border: 1px solid rgba(74, 222, 128, 0.3); }
        .badge.warning { background: rgba(250, 204, 21, 0.15); color: #facc15; border: 1px solid rgba(250, 204, 21, 0.3); }
        .badge.error { background: rgba(248, 113, 113, 0.15); color: #f87171; border: 1px solid rgba(248, 113, 113, 0.3); }
        .table-card { background: #141416; border: 1px solid #27272a; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
        .table-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #27272a; padding-bottom: 12px; margin-bottom: 12px; }
        .table-name { font-size: 1.2rem; font-weight: bold; color: #fff; }
        .table-status { font-weight: bold; font-size: 0.85rem; }
        .col-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; margin-top: 10px; }
        .col-item { background: #0c0c0e; border: 1px solid #27272a; padding: 10px 14px; border-radius: 8px; display: flex; align-items: center; gap: 10px; font-size: 0.85rem; }
        .col-item.missing { border-color: rgba(248, 113, 113, 0.4); background: rgba(248, 113, 113, 0.03); }
        .check-icon { color: #4ade80; font-weight: bold; }
        .cross-icon { color: #f87171; font-weight: bold; }
        .info-box { background: #18181b; border-left: 4px solid #D4AF37; padding: 15px; border-radius: 0 8px 8px 0; margin-bottom: 20px; font-size: 0.9rem; line-height: 1.5; color: #d4d4d8; }
        .btn-refresh { background: #D4AF37; color: #000; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: bold; text-decoration: none; display: inline-block; font-size: 0.85rem; }
        .btn-refresh:hover { background: #E5C76B; }
    </style>
</head>
<body>
    <h1>LMS Database Integrity Diagnostics</h1>

    <?php
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";port=" . DB_PORT . ";charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ];

    try {
        $db = null;
        try {
            $db = new PDO($dsn, DB_USER, DB_PASS, $options);
        } catch (PDOException $e) {
            // Try fallback password
            $fallbackPass = defined('DB_PASS_FALLBACK') ? DB_PASS_FALLBACK : '';
            if ($fallbackPass !== '' && $fallbackPass !== DB_PASS) {
                $db = new PDO($dsn, DB_USER, $fallbackPass, $options);
            } else {
                throw $e;
            }
        }

        // Fetch actual tables in database
        $stmt = $db->query("SHOW TABLES");
        $actualTables = $stmt->fetchAll(PDO::FETCH_COLUMN);

        $missingTablesCount = 0;
        $missingColumnsCount = 0;
        $tableReports = [];

        foreach ($expectedSchema as $tableName => $columns) {
            $report = [
                'exists' => in_array($tableName, $actualTables),
                'columns' => []
            ];

            if ($report['exists']) {
                // Fetch actual columns of this table
                $descStmt = $db->query("DESCRIBE `$tableName`");
                $actualColumns = $descStmt->fetchAll(PDO::FETCH_COLUMN);

                foreach ($columns as $colName) {
                    $hasCol = in_array($colName, $actualColumns);
                    $report['columns'][$colName] = $hasCol;
                    if (!$hasCol) {
                        $missingColumnsCount++;
                    }
                }
            } else {
                $missingTablesCount++;
                foreach ($columns as $colName) {
                    $report['columns'][$colName] = false;
                }
            }

            $tableReports[$tableName] = $report;
        }

        // Determine Overall Database Status
        $statusBadge = '';
        $statusClass = '';
        if ($missingTablesCount === 0 && $missingColumnsCount === 0) {
            $statusBadge = 'PERFECT';
            $statusClass = 'perfect';
            $statusTitle = 'Database is 100% Healthy!';
            $statusDesc = 'All expected tables and their columns are present and ready for production deployment.';
        } elseif ($missingTablesCount > 0) {
            $statusBadge = 'CRITICAL ERROR';
            $statusClass = 'error';
            $statusTitle = 'Missing Database Tables!';
            $statusDesc = "There are $missingTablesCount table(s) and $missingColumnsCount column(s) missing from the database.";
        } else {
            $statusBadge = 'WARNING';
            $statusClass = 'warning';
            $statusTitle = 'Missing Table Columns!';
            $statusDesc = "All tables exist, but $missingColumnsCount column(s) are missing inside them.";
        }
        ?>

        <div class="summary-card">
            <div>
                <div class="summary-title"><?php echo htmlspecialchars($statusTitle); ?></div>
                <div class="summary-desc"><?php echo htmlspecialchars($statusDesc); ?></div>
            </div>
            <div class="badge <?php echo $statusClass; ?>"><?php echo $statusBadge; ?></div>
        </div>

        <div class="info-box">
            <strong>Diagnostic Info:</strong> Connected to database <code><?php echo htmlspecialchars(DB_NAME); ?></code> on <code><?php echo htmlspecialchars(DB_HOST); ?></code>.<br>
            If you see any missing columns, make sure you imported both <code>production_migration.sql</code> and <code>production_migration_remaining.sql</code> files.
        </div>

        <?php
        foreach ($tableReports as $tableName => $rep) {
            $tableStatusText = $rep['exists'] ? '✅ EXISTS' : '❌ MISSING';
            $tableStatusClass = $rep['exists'] ? 'success' : 'danger';
            ?>
            <div class="table-card">
                <div class="table-header">
                    <span class="table-name">Table: <?php echo htmlspecialchars($tableName); ?></span>
                    <span class="table-status" style="color: <?php echo $rep['exists'] ? '#4ade80' : '#f87171'; ?>">
                        <?php echo $tableStatusText; ?>
                    </span>
                </div>
                <div class="col-grid">
                    <?php foreach ($rep['columns'] as $colName => $exists) { ?>
                        <div class="col-item <?php echo $exists ? '' : 'missing'; ?>">
                            <span class="<?php echo $exists ? 'check-icon' : 'cross-icon'; ?>">
                                <?php echo $exists ? '✓' : '✗'; ?>
                            </span>
                            <span><?php echo htmlspecialchars($colName); ?></span>
                        </div>
                    <?php } ?>
                </div>
            </div>
            <?php
        }

    } catch (Exception $e) {
        echo "<div class='summary-card' style='border-color: #f87171;'>
            <div>
                <div class='summary-title' style='color: #f87171;'>❌ Database Connection Error</div>
                <div class='summary-desc'>" . htmlspecialchars($e->getMessage()) . "</div>
            </div>
            <div class='badge error'>OFFLINE</div>
        </div>";
    }
    ?>
    <div style="text-align: center; margin-top: 30px; padding-bottom: 50px;">
        <button onclick="window.location.reload()" class="btn-refresh">Re-Run Diagnostics</button>
    </div>
    
    <?php
    if (isset($_GET['debug'])) {
        try {
            $stmt = $db->query("SHOW TABLES");
            $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
            echo "<div style='max-width: 800px; margin: 20px auto; padding: 20px; background: #1f2937; border: 1px solid #374151; border-radius: 8px; color: #f3f4f6; text-align: left;'>";
            echo "<h3 style='margin-top:0; color: #f59e0b;'>Debug Info: Active Tables in " . htmlspecialchars(DB_NAME) . "</h3>";
            echo "<pre style='background: #111827; padding: 10px; border-radius: 4px; overflow-x: auto;'>" . htmlspecialchars(print_r($tables, true)) . "</pre>";
            echo "</div>";
        } catch (Exception $e) {
            echo "<div style='max-width: 800px; margin: 20px auto; padding: 20px; background: #7f1d1d; color: #fca5a5;'>Debug Error: " . htmlspecialchars($e->getMessage()) . "</div>";
        }
    }
    ?>
</body>
</html>
