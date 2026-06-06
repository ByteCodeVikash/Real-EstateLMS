<?php
/**
 * Automated Verification Script for Assignment Management System Backend
 * Run via: php backend/tests/verify_assignments_schema.php
 */

define('SECURE_ENTRY', true);
require_once __DIR__ . '/../config/db.php';
require_once __DIR__ . '/../helpers/validation.php';
require_once __DIR__ . '/../models/Assignment.php';
require_once __DIR__ . '/../models/AssignmentSubmission.php';

// Colors for terminal output
define('GREEN', "\033[0;32m");
define('RED', "\033[0;31m");
define('YELLOW', "\033[1;33m");
define('NC', "\033[0m");

$testsRun = 0;
$testsPassed = 0;
$findings = [];

function assertTest(string $name, bool $expression, string $failureMessage = '') {
    global $testsRun, $testsPassed, $findings;
    $testsRun++;
    if ($expression) {
        $testsPassed++;
        echo GREEN . "  [PASS] " . NC . $name . "\n";
    } else {
        echo RED . "  [FAIL] " . NC . $name . "\n";
        if ($failureMessage) {
            echo "         Reason: " . $failureMessage . "\n";
            $findings[] = "[FAIL] " . $name . " - " . $failureMessage;
        } else {
            $findings[] = "[FAIL] " . $name;
        }
    }
}

echo YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "ASSIGNMENT SYSTEM SCHEMA & LOGIC VERIFICATION" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n\n";

try {
    $db = Database::getConnection();
} catch (Exception $e) {
    echo RED . "Error: Cannot connect to the database: " . $e->getMessage() . NC . "\n";
    exit(1);
}

// -----------------------------------------------------------------------------
// 1. SCHEMA STRUCTURE VERIFICATION
// -----------------------------------------------------------------------------
echo YELLOW . "--- 1. Verifying Database Tables & Columns ---" . NC . "\n";

// A. Check assignments table columns
$assignCols = [];
$stmt = $db->query("DESCRIBE assignments");
while ($row = $stmt->fetch()) {
    $assignCols[$row['Field']] = $row;
}

assertTest("Table 'assignments' exists", !empty($assignCols));
assertTest("'assignments.id' column", isset($assignCols['id']) && strpos($assignCols['id']['Type'], 'int') !== false && $assignCols['id']['Key'] === 'PRI');
assertTest("'assignments.course_id' column", isset($assignCols['course_id']) && strpos($assignCols['course_id']['Type'], 'int') !== false && $assignCols['course_id']['Null'] === 'NO');
assertTest("'assignments.module_id' column", isset($assignCols['module_id']) && strpos($assignCols['module_id']['Type'], 'int') !== false && $assignCols['module_id']['Null'] === 'YES');
assertTest("'assignments.title' column", isset($assignCols['title']) && strpos($assignCols['title']['Type'], 'varchar(255)') !== false && $assignCols['title']['Null'] === 'NO');
assertTest("'assignments.description' column", isset($assignCols['description']) && strpos($assignCols['description']['Type'], 'text') !== false && $assignCols['description']['Null'] === 'YES');
assertTest("'assignments.instructions' column", isset($assignCols['instructions']) && strpos($assignCols['instructions']['Type'], 'text') !== false && $assignCols['instructions']['Null'] === 'YES');
assertTest("'assignments.due_date' column", isset($assignCols['due_date']) && strpos($assignCols['due_date']['Type'], 'datetime') !== false && $assignCols['due_date']['Null'] === 'YES');
assertTest("'assignments.max_marks' column", isset($assignCols['max_marks']) && strpos($assignCols['max_marks']['Type'], 'int') !== false && $assignCols['max_marks']['Null'] === 'NO');
assertTest("'assignments.status' column", isset($assignCols['status']) && strpos($assignCols['status']['Type'], "enum('Draft','Published','Archived')") !== false && $assignCols['status']['Null'] === 'NO');
assertTest("'assignments.created_by' column", isset($assignCols['created_by']) && strpos($assignCols['created_by']['Type'], 'int') !== false && $assignCols['created_by']['Null'] === 'NO');

// B. Check assignment_submissions table columns
$subCols = [];
$stmt = $db->query("DESCRIBE assignment_submissions");
while ($row = $stmt->fetch()) {
    $subCols[$row['Field']] = $row;
}

assertTest("Table 'assignment_submissions' exists", !empty($subCols));
assertTest("'assignment_submissions.id' column", isset($subCols['id']) && strpos($subCols['id']['Type'], 'int') !== false && $subCols['id']['Key'] === 'PRI');
assertTest("'assignment_submissions.assignment_id' column", isset($subCols['assignment_id']) && strpos($subCols['assignment_id']['Type'], 'int') !== false && $subCols['assignment_id']['Null'] === 'NO');
assertTest("'assignment_submissions.student_id' column", isset($subCols['student_id']) && strpos($subCols['student_id']['Type'], 'int') !== false && $subCols['student_id']['Null'] === 'NO');
assertTest("'assignment_submissions.file_path' column", isset($subCols['file_path']) && strpos($subCols['file_path']['Type'], 'varchar(255)') !== false && $subCols['file_path']['Null'] === 'NO');
assertTest("'assignment_submissions.submitted_at' column", isset($subCols['submitted_at']) && (strpos($subCols['submitted_at']['Type'], 'timestamp') !== false || strpos($subCols['submitted_at']['Type'], 'datetime') !== false) && $subCols['submitted_at']['Null'] === 'NO');
assertTest("'assignment_submissions.marks' column", isset($subCols['marks']) && strpos($subCols['marks']['Type'], 'int') !== false && $subCols['marks']['Null'] === 'YES');
assertTest("'assignment_submissions.feedback' column", isset($subCols['feedback']) && strpos($subCols['feedback']['Type'], 'text') !== false && $subCols['feedback']['Null'] === 'YES');
assertTest("'assignment_submissions.status' column", isset($subCols['status']) && strpos($subCols['status']['Type'], "enum('Submitted','Under Review','Graded','Revision Requested')") !== false && $subCols['status']['Null'] === 'NO');
assertTest("'assignment_submissions.graded_by' column", isset($subCols['graded_by']) && strpos($subCols['graded_by']['Type'], 'int') !== false && $subCols['graded_by']['Null'] === 'YES');
assertTest("'assignment_submissions.graded_at' column", isset($subCols['graded_at']) && (strpos($subCols['graded_at']['Type'], 'timestamp') !== false || strpos($subCols['graded_at']['Type'], 'datetime') !== false) && $subCols['graded_at']['Null'] === 'YES');

// -----------------------------------------------------------------------------
// 2. FOREIGN KEYS & INDEXES VERIFICATION
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 2. Verifying Foreign Keys & Indexes ---" . NC . "\n";

// Helper to query key constraints
$dbName = DB_NAME;
$fkQuery = "SELECT CONSTRAINT_NAME, COLUMN_NAME, REFERENCED_TABLE_NAME, REFERENCED_COLUMN_NAME 
            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NOT NULL";

// A. Assignments table FKs
$stmt = $db->prepare($fkQuery);
$stmt->execute([$dbName, 'assignments']);
$assignFKs = $stmt->fetchAll(PDO::FETCH_ASSOC);

$fkCourseOk = false;
$fkModuleOk = false;
$fkCreatorOk = false;

foreach ($assignFKs as $fk) {
    if ($fk['COLUMN_NAME'] === 'course_id' && $fk['REFERENCED_TABLE_NAME'] === 'courses' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
        $fkCourseOk = true;
    }
    if ($fk['COLUMN_NAME'] === 'module_id' && $fk['REFERENCED_TABLE_NAME'] === 'course_modules' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
        $fkModuleOk = true;
    }
    if ($fk['COLUMN_NAME'] === 'created_by' && $fk['REFERENCED_TABLE_NAME'] === 'users' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
        $fkCreatorOk = true;
    }
}

assertTest("Foreign key: assignments.course_id -> courses.id exists", $fkCourseOk);
assertTest("Foreign key: assignments.module_id -> course_modules.id exists", $fkModuleOk);
assertTest("Foreign key: assignments.created_by -> users.id exists", $fkCreatorOk);

// B. Submissions table FKs
$stmt->execute([$dbName, 'assignment_submissions']);
$subFKs = $stmt->fetchAll(PDO::FETCH_ASSOC);

$fkSubAssignOk = false;
$fkSubStudentOk = false;
$fkSubGraderOk = false;

foreach ($subFKs as $fk) {
    if ($fk['COLUMN_NAME'] === 'assignment_id' && $fk['REFERENCED_TABLE_NAME'] === 'assignments' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
        $fkSubAssignOk = true;
    }
    if ($fk['COLUMN_NAME'] === 'student_id' && $fk['REFERENCED_TABLE_NAME'] === 'users' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
        $fkSubStudentOk = true;
    }
    if ($fk['COLUMN_NAME'] === 'graded_by' && $fk['REFERENCED_TABLE_NAME'] === 'users' && $fk['REFERENCED_COLUMN_NAME'] === 'id') {
        $fkSubGraderOk = true;
    }
}

assertTest("Foreign key: assignment_submissions.assignment_id -> assignments.id exists", $fkSubAssignOk);
assertTest("Foreign key: assignment_submissions.student_id -> users.id exists", $fkSubStudentOk);
assertTest("Foreign key: assignment_submissions.graded_by -> users.id exists", $fkSubGraderOk);

// C. Verify Unique Constraint
$stmtUnique = $db->prepare("SELECT CONSTRAINT_NAME, COLUMN_NAME 
                            FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
                            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND REFERENCED_TABLE_NAME IS NULL AND CONSTRAINT_NAME != 'PRIMARY'");
$stmtUnique->execute([$dbName, 'assignment_submissions']);
$uniques = $stmtUnique->fetchAll(PDO::FETCH_ASSOC);

$uniqueStudentAssignOk = false;
$uniqueKeysMap = [];
foreach ($uniques as $u) {
    $uniqueKeysMap[$u['CONSTRAINT_NAME']][] = $u['COLUMN_NAME'];
}
foreach ($uniqueKeysMap as $constName => $cols) {
    if (count($cols) === 2 && in_array('student_id', $cols) && in_array('assignment_id', $cols)) {
        $uniqueStudentAssignOk = true;
        break;
    }
}
assertTest("Unique constraint uk_student_assignment exists on (student_id, assignment_id)", $uniqueStudentAssignOk);

// D. Verify Indexes
$stmtIndex = $db->prepare("SELECT INDEX_NAME, COLUMN_NAME FROM INFORMATION_SCHEMA.STATISTICS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?");

$stmtIndex->execute([$dbName, 'assignments']);
$assignIndexes = $stmtIndex->fetchAll(PDO::FETCH_ASSOC);
$assignIdxCols = array_column($assignIndexes, 'COLUMN_NAME');

assertTest("Index exists on assignments.course_id", in_array('course_id', $assignIdxCols));
assertTest("Index exists on assignments.module_id", in_array('module_id', $assignIdxCols));
assertTest("Index exists on assignments.created_by", in_array('created_by', $assignIdxCols));
assertTest("Index exists on assignments.status", in_array('status', $assignIdxCols));

$stmtIndex->execute([$dbName, 'assignment_submissions']);
$subIndexes = $stmtIndex->fetchAll(PDO::FETCH_ASSOC);
$subIdxCols = array_column($subIndexes, 'COLUMN_NAME');

assertTest("Index exists on assignment_submissions.assignment_id", in_array('assignment_id', $subIdxCols));
assertTest("Index exists on assignment_submissions.student_id", in_array('student_id', $subIdxCols));
assertTest("Index exists on assignment_submissions.graded_by", in_array('graded_by', $subIdxCols));
assertTest("Index exists on assignment_submissions.status", in_array('status', $subIdxCols));

// -----------------------------------------------------------------------------
// 3. VALIDATION LAYER TESTING
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 3. Testing Validation Layer ---" . NC . "\n";

// Retrieve valid Course, Module, and User IDs for tests
$courseId = (int)$db->query("SELECT id FROM courses LIMIT 1")->fetchColumn();
$moduleId = (int)$db->query("SELECT id FROM course_modules WHERE course_id = $courseId LIMIT 1")->fetchColumn();
$instructorId = (int)$db->query("SELECT id FROM users WHERE role = 'instructor' LIMIT 1")->fetchColumn();
$studentId = (int)$db->query("SELECT id FROM users WHERE role = 'student' LIMIT 1")->fetchColumn();
$adminId = (int)$db->query("SELECT id FROM users WHERE role = 'admin' LIMIT 1")->fetchColumn();

// Force enrollment for testing validations/models (in case migration seeded otherwise)
$db->prepare("INSERT IGNORE INTO enrollments (user_id, course_id, progress, completion_status) VALUES (?, ?, 0, 'Active')")->execute([$studentId, $courseId]);

// A. Assignment Validation
$validAssignData = [
    'course_id' => $courseId,
    'module_id' => $moduleId,
    'title' => 'Valid Test Assignment',
    'description' => 'A valid description.',
    'instructions' => 'Read materials and submit.',
    'due_date' => '2026-12-31 23:59:59',
    'max_marks' => 100,
    'status' => 'Published',
    'created_by' => $instructorId
];

$errors = validateAssignment($validAssignData);
assertTest("validateAssignment approves valid data", empty($errors), "Errors returned: " . json_encode($errors));

$invalidAssignData = [
    'course_id' => 99999, // non-existent
    'module_id' => 99999, // non-existent
    'title' => '',        // empty
    'due_date' => 'invalid-date-string',
    'max_marks' => -10,   // negative marks
    'status' => 'InvalidStatus',
    'created_by' => $studentId // Student role not allowed to create
];

$errors = validateAssignment($invalidAssignData);
assertTest("validateAssignment flags invalid course_id", isset($errors['course_id']));
assertTest("validateAssignment flags invalid module_id", isset($errors['module_id']));
assertTest("validateAssignment flags empty title", isset($errors['title']));
assertTest("validateAssignment flags invalid due_date", isset($errors['due_date']));
assertTest("validateAssignment flags invalid max_marks", isset($errors['max_marks']));
assertTest("validateAssignment flags invalid status", isset($errors['status']));
assertTest("validateAssignment flags student role created_by", isset($errors['created_by']));

// B. Submission Validation
// Create a temporary published assignment for submission validation tests
$tempAssignId = Assignment::create([
    'course_id' => $courseId,
    'module_id' => $moduleId,
    'title' => 'Temp Submission Test Assignment',
    'status' => 'Published',
    'created_by' => $instructorId
]);

$validSubData = [
    'assignment_id' => $tempAssignId,
    'student_id' => $studentId,
    'file_path' => '/uploads/submissions/test_file.zip'
];

$errors = validateSubmission($validSubData);
assertTest("validateSubmission approves valid data", empty($errors), "Errors returned: " . json_encode($errors));

$invalidSubData = [
    'assignment_id' => 99999, // non-existent
    'student_id' => $instructorId, // instructor cannot submit
    'file_path' => '' // empty
];

$errors = validateSubmission($invalidSubData);
assertTest("validateSubmission flags invalid assignment_id", isset($errors['assignment_id']));
assertTest("validateSubmission flags invalid student_id role", isset($errors['student_id']));
assertTest("validateSubmission flags empty file_path", isset($errors['file_path']));

// C. Grading Validation
$errors = validateGrading(['marks' => 85, 'status' => 'Graded', 'graded_by' => $instructorId], 100);
assertTest("validateGrading approves valid grading data", empty($errors), "Errors: " . json_encode($errors));

$errors = validateGrading(['marks' => 120, 'status' => 'Graded', 'graded_by' => $studentId], 100);
assertTest("validateGrading flags marks exceeding maximum", isset($errors['marks']));
assertTest("validateGrading flags invalid grader role", isset($errors['graded_by']));

// -----------------------------------------------------------------------------
// 4. MODEL & PERMISSION LAYER INTEGRATION TESTING
// -----------------------------------------------------------------------------
echo "\n" . YELLOW . "--- 4. Testing Models & Permission Logic ---" . NC . "\n";

// Mock User Sessions
$adminUser = ['id' => $adminId, 'role' => 'admin'];
$instructorUser = ['id' => $instructorId, 'role' => 'instructor'];
$studentUser = ['id' => $studentId, 'role' => 'student'];

// A. Check Assignment Access Rules
assertTest("Admin has 'create' assignment access", Assignment::hasAccess($adminUser, null, 'create', $courseId));
assertTest("Admin has 'read' assignment access", Assignment::hasAccess($adminUser, $tempAssignId, 'read'));
assertTest("Admin has 'update' assignment access", Assignment::hasAccess($adminUser, $tempAssignId, 'update'));
assertTest("Admin has 'delete' assignment access", Assignment::hasAccess($adminUser, $tempAssignId, 'delete'));

// Instructor owns course by setup
// Verify instructor course ownership
$stmtCourseOwner = $db->prepare("SELECT created_by FROM courses WHERE id = ?");
$stmtCourseOwner->execute([$courseId]);
$actualOwner = (int)$stmtCourseOwner->fetchColumn();

// If current instructor is not course creator, temporarily update the course creator to this instructor for test validation
if ($actualOwner !== $instructorId) {
    $db->prepare("UPDATE courses SET created_by = ? WHERE id = ?")->execute([$instructorId, $courseId]);
}

assertTest("Instructor has 'create' access to own course assignment", Assignment::hasAccess($instructorUser, null, 'create', $courseId));
assertTest("Instructor has 'update' access to own assignment", Assignment::hasAccess($instructorUser, $tempAssignId, 'update'));

// Another instructor who does not own the course
$otherInstructorUser = ['id' => 99998, 'role' => 'instructor'];
assertTest("Other instructor blocked from 'create' assignment", !Assignment::hasAccess($otherInstructorUser, null, 'create', $courseId));
assertTest("Other instructor blocked from 'update' assignment", !Assignment::hasAccess($otherInstructorUser, $tempAssignId, 'update'));

// Student access rules
assertTest("Student blocked from 'create' assignment", !Assignment::hasAccess($studentUser, null, 'create', $courseId));
assertTest("Student blocked from 'update' assignment", !Assignment::hasAccess($studentUser, $tempAssignId, 'update'));
assertTest("Student has 'read' access to enrolled published assignment", Assignment::hasAccess($studentUser, $tempAssignId, 'read'));

// Verify student blocked if assignment is draft
$draftAssignId = Assignment::create([
    'course_id' => $courseId,
    'module_id' => $moduleId,
    'title' => 'Draft Assignment',
    'status' => 'Draft',
    'created_by' => $instructorId
]);
assertTest("Student blocked from 'read' draft assignment", !Assignment::hasAccess($studentUser, $draftAssignId, 'read'));

// B. Check Submission CRUD & Access Rules
$submissionId = AssignmentSubmission::submit([
    'assignment_id' => $tempAssignId,
    'student_id' => $studentId,
    'file_path' => '/uploads/submissions/test_submit.pdf'
]);

assertTest("AssignmentSubmission::submit creates record", $submissionId > 0);

// Check access rules for submissions
assertTest("Admin has access to view submission", AssignmentSubmission::hasAccess($adminUser, $submissionId, 'read'));
assertTest("Instructor has access to view/grade submission in own course", AssignmentSubmission::hasAccess($instructorUser, $submissionId, 'read'));
assertTest("Instructor has access to grade submission in own course", AssignmentSubmission::hasAccess($instructorUser, $submissionId, 'grade'));
assertTest("Other instructor blocked from viewing submission", !AssignmentSubmission::hasAccess($otherInstructorUser, $submissionId, 'read'));
assertTest("Student has access to view own submission", AssignmentSubmission::hasAccess($studentUser, $submissionId, 'read'));

// Student 2 (unrelated)
$otherStudentUser = ['id' => 99997, 'role' => 'student'];
assertTest("Other student blocked from viewing submission", !AssignmentSubmission::hasAccess($otherStudentUser, $submissionId, 'read'));

// C. Test Grading Logic & Fetching
$gradeSuccess = AssignmentSubmission::grade($submissionId, $instructorId, 95, 'Well done! Outstanding research report.');
assertTest("AssignmentSubmission::grade executes successfully", $gradeSuccess);

$subFetched = AssignmentSubmission::findById($submissionId);
assertTest("Submission details mapped correctly", 
           $subFetched && 
           $subFetched['marks'] === 95 && 
           $subFetched['status'] === 'Graded' && 
           $subFetched['graded_by'] === $instructorId && 
           !empty($subFetched['graded_at'])
);

// D. Clean up temporary test data
Assignment::delete($tempAssignId);
Assignment::delete($draftAssignId);

echo "\n" . YELLOW . "==================================================" . NC . "\n";
echo YELLOW . "VERIFICATION COMPLETED: {$testsPassed} / {$testsRun} PASSED" . NC . "\n";
echo YELLOW . "==================================================" . NC . "\n";

if ($testsPassed === $testsRun) {
    echo GREEN . "All database schemas, constraints, indexes, validations, models, and permission rules are correctly configured and verified!" . NC . "\n";
    exit(0);
} else {
    echo RED . "Some verification tests failed. Please review findings." . NC . "\n";
    exit(1);
}
