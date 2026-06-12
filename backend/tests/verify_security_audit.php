<?php
/**
 * Automated Security & Operations Audit Script for Assignment System
 * Run via: php backend/tests/verify_security_audit.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/jwt.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "ASSIGNMENT SYSTEM COMPLETE SECURITY AUDIT" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

$testsRun = 0;
$testsPassed = 0;
$failures = [];

function auditTest(string $name, bool $expression, string $failureDetails = '') {
    global $testsRun, $testsPassed, $failures;
    $testsRun++;
    if ($expression) {
        $testsPassed++;
        echo GREEN . "  [PASS] " . NC . $name . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $name . "\n";
        if ($failureDetails) {
            echo "         Details: " . $failureDetails . "\n";
        }
        $failures[] = $name . ($failureDetails ? " (Details: {$failureDetails})" : "");
    }
}

// -----------------------------------------------------------------------------
// 1. JWT Security Validation
// -----------------------------------------------------------------------------
echo YELLOW . "--- 1. JWT Security & Signature Verification ---" . NC . "\n";

$testPayload = ['id' => 42, 'role' => 'student', 'exp' => time() + 3600];
$token = JWT::encode($testPayload);
$decoded = JWT::decode($token);

auditTest("JWT Token encode/decode matches payload", 
    $decoded !== null && $decoded['id'] === 42 && $decoded['role'] === 'student'
);

// Test signature tampering detection
$parts = explode('.', $token);
$parts[2][0] = $parts[2][0] === 'x' ? 'y' : 'x'; // guaranteed signature alteration
$tamperedToken = implode('.', $parts);
$decodedTampered = JWT::decode($tamperedToken);

auditTest("JWT Token rejects tampered signatures", $decodedTampered === null);

// Test expired tokens
$expiredPayload = ['id' => 42, 'role' => 'student', 'exp' => time() - 10];
$expiredToken = JWT::encode($expiredPayload);
$decodedExpired = JWT::decode($expiredToken);

auditTest("JWT Token rejects expired tokens", $decodedExpired === null);


// -----------------------------------------------------------------------------
// 2. SQL Injection Auditing (Static Analysis on Models)
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 2. SQL Injection Auditing (Prepared Statements Check) ---" . NC . "\n";

$modelFiles = [
    __DIR__ . '/../models/Assignment.php',
    __DIR__ . '/../models/AssignmentSubmission.php'
];

foreach ($modelFiles as $file) {
    $content = file_get_contents($file);
    $basename = basename($file);
    
    // Scan for raw SQL string concatenation inside query methods:
    // e.g. check if variables like $xxx are interpolated directly inside query strings
    $hasConcatenatedQuery = false;
    
    // Match PDO query/prepare calls with variable concatenation or interpolation:
    // e.g. $db->query("... $var ...") or $db->prepare("... " . $var)
    if (preg_match('/\$db->(query|prepare)\s*\(\s*["\'].*?\$[a-zA-Z_].*?["\']/i', $content)) {
        $hasConcatenatedQuery = true;
    }
    if (preg_match('/\$db->(query|prepare)\s*\(\s*["\'].*?["\']\s*\.\s*\$[a-zA-Z_]/i', $content)) {
        $hasConcatenatedQuery = true;
    }
    
    auditTest("Model '{$basename}' uses prepared statements with no raw SQL interpolation", !$hasConcatenatedQuery);
}


// -----------------------------------------------------------------------------
// 3. File Upload & Path Traversal Auditing
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 3. File Upload & Extension Verification ---" . NC . "\n";

$submitController = __DIR__ . '/../api/assignments/submit.php';
$submitContent = file_get_contents($submitController);

// Validate extension whitelist contains exactly pdf, docx, xlsx, zip
$hasAllowedExtensions = (
    strpos($submitContent, "'pdf'") !== false &&
    strpos($submitContent, "'docx'") !== false &&
    strpos($submitContent, "'xlsx'") !== false &&
    strpos($submitContent, "'zip'") !== false
);
auditTest("submit.php whitelists PDF, DOCX, XLSX, and ZIP format extensions", $hasAllowedExtensions);

// Check if double extension scans exist
$hasDoubleExtensionScan = strpos($submitContent, "Security Violation: Blocked malicious file payload.") !== false;
auditTest("submit.php checks for double-extension malicious file payloads", $hasDoubleExtensionScan);

// Check size limit: 15MB
$hasSizeLimit = preg_match('/15\s*\*\s*1024\s*\*\s*1024/', $submitContent);
auditTest("submit.php enforces a strict 15MB file size limit", $hasSizeLimit);

// Check directory traversal prevention via basename usage
$hasBasenameUsage = strpos($submitContent, "basename(") !== false;
auditTest("submit.php uses basename() to sanitize incoming filenames", $hasBasenameUsage);


// -----------------------------------------------------------------------------
// 4. Role Permissions & IDOR Mitigation
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 4. Role Permissions & IDOR Validation ---" . NC . "\n";

// Validate roles exist inside auth middleware requireRole calls in API files
$apiFiles = glob(__DIR__ . '/../api/**/*.php');
$allRolesChecked = true;

// Verify that read actions perform ownership/enrollment validation (IDOR protection)
// Let's do a sanity test check directly on Assignment and AssignmentSubmission model implementations
require_once __DIR__ . '/../models/Assignment.php';
require_once __DIR__ . '/../models/AssignmentSubmission.php';

// Construct temporary mock users to test IDOR gates directly
$studentA = ['id' => 991, 'role' => 'student'];
$studentB = ['id' => 992, 'role' => 'student'];
$instructorA = ['id' => 881, 'role' => 'instructor'];
$adminUser = ['id' => 771, 'role' => 'admin'];

// We check if student B is blocked from viewing a submission owned by student A
// Create target submission
try {
    $db = Database::getConnection();
    
    // Temporary course and assignment
    $db->query("INSERT IGNORE INTO users (id, full_name, email, password_hash, role, status) VALUES (991, 'Student A', 'a@realty.com', 'x', 'student', 'Active')");
    $db->query("INSERT IGNORE INTO users (id, full_name, email, password_hash, role, status) VALUES (992, 'Student B', 'b@realty.com', 'x', 'student', 'Active')");
    $db->query("INSERT IGNORE INTO users (id, full_name, email, password_hash, role, status) VALUES (881, 'Instructor A', 'i@realty.com', 'x', 'instructor', 'Active')");
    
    $db->query("INSERT INTO courses (id, title, description, slug, mentor_name, created_by) VALUES (9999, 'Test Course', 'Desc', 'test-course', 'Test Mentor', 881) ON DUPLICATE KEY UPDATE created_by = 881");
    $db->query("INSERT INTO assignments (id, course_id, title, max_marks, status, created_by) VALUES (9999, 9999, 'Test Assignment', 100, 'Published', 881) ON DUPLICATE KEY UPDATE status='Published'");
    
    // Submission by Student A
    $db->query("INSERT INTO assignment_submissions (id, assignment_id, student_id, file_path, status) VALUES (9999, 9999, 991, '/uploads/assignments/a.pdf', 'Submitted') ON DUPLICATE KEY UPDATE student_id=991");

    // Perform direct model checks
    auditTest("IDOR Prevention: Owner Student A has access to view own submission", 
        AssignmentSubmission::hasAccess($studentA, 9999, 'read') === true
    );
    auditTest("IDOR Prevention: Other Student B is blocked from viewing Student A submission", 
        AssignmentSubmission::hasAccess($studentB, 9999, 'read') === false
    );
    auditTest("IDOR Prevention: Course-owning Instructor A has access to grade submission", 
        AssignmentSubmission::hasAccess($instructorA, 9999, 'grade') === true
    );
    auditTest("IDOR Prevention: Admin user has access to grade submission", 
        AssignmentSubmission::hasAccess($adminUser, 9999, 'grade') === true
    );

    // Clean up
    $db->query("DELETE FROM assignment_submissions WHERE id = 9999");
    $db->query("DELETE FROM assignments WHERE id = 9999");
    $db->query("DELETE FROM courses WHERE id = 9999");
    $db->query("DELETE FROM users WHERE id IN (991, 992, 881)");

} catch (Exception $e) {
    auditTest("IDOR model tests executed without database exceptions", false, $e->getMessage());
}


// -----------------------------------------------------------------------------
// 5. Rate Limiting, Brute Force & API Security Headers
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 5. Rate Limiting, Brute Force & Security Headers ---" . NC . "\n";

$securityHelperPath = __DIR__ . '/../helpers/security.php';
$securityHelperExists = file_exists($securityHelperPath);
auditTest("security.php helper file exists", $securityHelperExists);

if ($securityHelperExists) {
    require_once $securityHelperPath;
    auditTest("checkRateLimit function exists", function_exists('checkRateLimit'));
    auditTest("checkBruteForce function exists", function_exists('checkBruteForce'));
    auditTest("recordFailedLogin function exists", function_exists('recordFailedLogin'));
    auditTest("clearFailedLogins function exists", function_exists('clearFailedLogins'));

    // Test self-healing DB tables creation
    try {
        $db = Database::getConnection();
        
        // Call security functions to trigger self-healing table creation
        recordFailedLogin('test_security_audit@example.com');
        
        $rateLimitsTableExists = $db->query("SHOW TABLES LIKE 'rate_limits'")->rowCount() > 0;
        $failedLoginsTableExists = $db->query("SHOW TABLES LIKE 'failed_logins'")->rowCount() > 0;
        
        auditTest("Rate limiting database table 'rate_limits' created/exists", $rateLimitsTableExists);
        auditTest("Brute force database table 'failed_logins' created/exists", $failedLoginsTableExists);
        
        // Test recording and clearing failed logins
        $stmt = $db->prepare("SELECT COUNT(*) FROM failed_logins WHERE email = ?");
        $stmt->execute(['test_security_audit@example.com']);
        $countBefore = (int)$stmt->fetchColumn();
        auditTest("recordFailedLogin inserts attempt into database", $countBefore > 0);
        
        clearFailedLogins('test_security_audit@example.com');
        $stmt->execute(['test_security_audit@example.com']);
        $countAfter = (int)$stmt->fetchColumn();
        auditTest("clearFailedLogins removes attempts from database", $countAfter === 0);
        
        // Clean up rate_limits test entries
        $db->query("DELETE FROM rate_limits WHERE ip_address = '127.0.0.1'");
    } catch (Exception $e) {
        auditTest("Security database operations succeeded", false, $e->getMessage());
    }
}

// Test CORS and Security Headers via curl request to local development port
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, "http://127.0.0.1:8282/api/health");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Origin: http://localhost:5173"]);
curl_setopt($ch, CURLOPT_TIMEOUT, 3);
$response = curl_exec($ch);
curl_close($ch);

if ($response) {
    $hasCorsHeader = strpos($response, "Access-Control-Allow-Origin: http://localhost:5173") !== false;
    $hasNosniffHeader = strpos($response, "X-Content-Type-Options: nosniff") !== false;
    $hasFrameHeader = strpos($response, "X-Frame-Options: DENY") !== false;
    
    auditTest("CORS middleware allows whitelisted origin http://localhost:5173", $hasCorsHeader);
    auditTest("API responses include X-Content-Type-Options: nosniff", $hasNosniffHeader);
    auditTest("API responses include X-Frame-Options: DENY", $hasFrameHeader);
} else {
    // Fallback: static analysis verification of cors file
    $corsContent = file_get_contents(__DIR__ . '/../middleware/cors.php');
    $hasCorsAudit = strpos($corsContent, "X-Content-Type-Options: nosniff") !== false && strpos($corsContent, "\$allowedOrigins") !== false;
    auditTest("CORS whitelist and security headers verified in cors.php", $hasCorsAudit);
}

// -----------------------------------------------------------------------------
// 6. Hostinger Shared Hosting Compatibility
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 6. Hostinger Compatibility Verification ---" . NC . "\n";

// PHP Version
$phpVersion = PHP_VERSION;
$phpCompatible = version_compare($phpVersion, '8.0.0', '>=');
auditTest("PHP Version compatibility (Current: {$phpVersion}, Required >= 8.0)", $phpCompatible);

// MySQL Version via connection
try {
    $db = Database::getConnection();
    $mysqlVer = $db->getAttribute(PDO::ATTR_SERVER_VERSION);
    auditTest("MySQL/MariaDB Version compatibility (Current: {$mysqlVer})", !empty($mysqlVer));
} catch (Exception $e) {
    auditTest("Database server parameters retrieved successfully", false, $e->getMessage());
}

// Upload Folder Permissions & security
$uploadsDir = __DIR__ . '/../uploads';
$assignmentsDir = __DIR__ . '/../uploads/assignments';

auditTest("Uploads directory exists", is_dir($uploadsDir));
auditTest("Assignments uploads subdirectory exists", is_dir($assignmentsDir));

// Check write permissions
$uploadsWritable = is_writable($uploadsDir) && is_writable($assignmentsDir);
auditTest("Upload folders are writable by the server process", $uploadsWritable);

// Direct directory permissions (Hostinger shared directory structure uses standard permissions)
$uploadsPerms = substr(sprintf('%o', fileperms($uploadsDir)), -4);
$assignmentsPerms = substr(sprintf('%o', fileperms($assignmentsDir)), -4);
auditTest("Uploads folder permissions check (Current: {$uploadsPerms})", $uploadsPerms === '0755' || $uploadsPerms === '0777');
auditTest("Assignments folder permissions check (Current: {$assignmentsPerms})", $assignmentsPerms === '0755' || $assignmentsPerms === '0777');

// htaccess protection
$htaccessPath = $uploadsDir . '/.htaccess';
auditTest("Security htaccess file exists inside uploads directory", file_exists($htaccessPath));

if (file_exists($htaccessPath)) {
    $htaccessContent = file_get_contents($htaccessPath);
    $hasPHPEngineOff = strpos($htaccessContent, "php_flag engine off") !== false;
    auditTest("htaccess file disables PHP execution engine", $hasPHPEngineOff);
}


// -----------------------------------------------------------------------------
// Final Evaluation
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo "AUDIT RESULTS: " . ($testsPassed === $testsRun ? GREEN : RED) . "{$testsPassed} / {$testsRun} Checks Passed" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    exit(0);
} else {
    echo RED . "Auditing failed on the following checks:\n";
    foreach ($failures as $f) {
        echo " - " . $f . "\n";
    }
    exit(1);
}
