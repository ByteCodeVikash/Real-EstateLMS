<?php
/**
 * Input & DB Validation Helpers for RealEstate LMS Assignment System
 */

require_once __DIR__ . '/../config/db.php';

/**
 * Validates assignment data (for creation or update)
 * 
 * @param array $data Input request data
 * @param bool $isUpdate True if editing an existing assignment
 * @param int|null $assignmentId The ID of the assignment being updated (needed for some checks)
 * @return array Array of errors. Empty if data is valid.
 */
function validateAssignment(array $data, bool $isUpdate = false, ?int $assignmentId = null): array {
    $errors = [];
    $db = Database::getConnection();

    // 1. Title validation
    if (!$isUpdate || isset($data['title'])) {
        $title = isset($data['title']) ? trim(strip_tags((string)$data['title'])) : '';
        if (empty($title)) {
            $errors['title'] = "Title is required and cannot be empty.";
        } elseif (strlen($title) > 255) {
            $errors['title'] = "Title cannot exceed 255 characters.";
        }
    }

    // Determine course_id for cross-validations
    $courseId = null;
    if (isset($data['course_id'])) {
        $courseId = (int)$data['course_id'];
    } elseif ($isUpdate && $assignmentId) {
        $stmt = $db->prepare("SELECT course_id FROM assignments WHERE id = ?");
        $stmt->execute([$assignmentId]);
        $courseId = (int)$stmt->fetchColumn();
    }

    // 2. Course ID validation
    if (!$isUpdate && !$courseId) {
        $errors['course_id'] = "Course ID is required.";
    } elseif (isset($data['course_id'])) {
        if ($courseId <= 0) {
            $errors['course_id'] = "Invalid Course ID.";
        } else {
            // Verify course exists in DB
            $stmt = $db->prepare("SELECT id FROM courses WHERE id = ?");
            $stmt->execute([$courseId]);
            if (!$stmt->fetch()) {
                $errors['course_id'] = "Referenced course does not exist.";
            }
        }
    }

    // 3. Module ID validation
    if (isset($data['module_id']) && $data['module_id'] !== null) {
        $moduleId = (int)$data['module_id'];
        if ($moduleId <= 0) {
            $errors['module_id'] = "Invalid Module ID.";
        } else {
            // Verify module exists and belongs to the correct course
            if ($courseId) {
                $stmt = $db->prepare("SELECT id FROM course_modules WHERE id = ? AND course_id = ?");
                $stmt->execute([$moduleId, $courseId]);
                if (!$stmt->fetch()) {
                    $errors['module_id'] = "Referenced module does not exist or does not belong to the selected course.";
                }
            } else {
                $stmt = $db->prepare("SELECT id FROM course_modules WHERE id = ?");
                $stmt->execute([$moduleId]);
                if (!$stmt->fetch()) {
                    $errors['module_id'] = "Referenced module does not exist.";
                }
            }
        }
    }

    // 4. Due Date validation
    if (isset($data['due_date']) && $data['due_date'] !== null) {
        $dueDateStr = trim((string)$data['due_date']);
        if (!empty($dueDateStr)) {
            $timestamp = strtotime($dueDateStr);
            if ($timestamp === false) {
                $errors['due_date'] = "Due date must be a valid datetime format (e.g. YYYY-MM-DD HH:MM:SS).";
            }
        }
    }

    // 5. Max Marks validation
    if (!$isUpdate || isset($data['max_marks'])) {
        $maxMarks = isset($data['max_marks']) ? (int)$data['max_marks'] : 100;
        if ($maxMarks <= 0) {
            $errors['max_marks'] = "Max marks must be a positive integer greater than 0.";
        }
    }

    // 6. Status validation
    if (isset($data['status'])) {
        $status = trim((string)$data['status']);
        if (!in_array($status, ['Draft', 'Published', 'Archived'])) {
            $errors['status'] = "Status must be 'Draft', 'Published', or 'Archived'.";
        }
    }

    // 7. Created By validation
    if (!$isUpdate && !isset($data['created_by'])) {
        $errors['created_by'] = "Creator ID is required.";
    } elseif (isset($data['created_by'])) {
        $createdBy = (int)$data['created_by'];
        if ($createdBy <= 0) {
            $errors['created_by'] = "Invalid creator ID.";
        } else {
            // Verify user exists and has permission to create assignments (Admin or Instructor)
            $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
            $stmt->execute([$createdBy]);
            $userRole = $stmt->fetchColumn();
            if (!$userRole) {
                $errors['created_by'] = "Referenced creator user does not exist.";
            } elseif (!in_array($userRole, ['super_admin', 'admin', 'instructor'])) {
                $errors['created_by'] = "Only administrators and instructors can create assignments.";
            }
        }
    }

    return $errors;
}

/**
 * Validates assignment submission data
 * 
 * @param array $data Input submission data
 * @return array Array of errors. Empty if data is valid.
 */
function validateSubmission(array $data): array {
    $errors = [];
    $db = Database::getConnection();

    // 1. Assignment ID validation
    $assignmentId = isset($data['assignment_id']) ? (int)$data['assignment_id'] : 0;
    if ($assignmentId <= 0) {
        $errors['assignment_id'] = "Assignment ID is required.";
    } else {
        // Verify assignment exists and is Published
        $stmt = $db->prepare("SELECT id, status, course_id FROM assignments WHERE id = ?");
        $stmt->execute([$assignmentId]);
        $assignment = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$assignment) {
            $errors['assignment_id'] = "Referenced assignment does not exist.";
        } elseif ($assignment['status'] !== 'Published') {
            $errors['assignment_id'] = "Cannot submit to an assignment that is not published.";
        }
    }

    // 2. Student ID validation
    $studentId = isset($data['student_id']) ? (int)$data['student_id'] : 0;
    if ($studentId <= 0) {
        $errors['student_id'] = "Student ID is required.";
    } else {
        // Verify student exists and has 'student' role
        $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
        $stmt->execute([$studentId]);
        $role = $stmt->fetchColumn();
        if (!$role) {
            $errors['student_id'] = "Referenced student does not exist.";
        } elseif ($role !== 'student') {
            // Note: Admins/Instructors could be testing, but assignment submissions are for students.
            // Let's enforce that submissions are made by students.
            $errors['student_id'] = "Only users with the 'student' role can submit assignments.";
        }

        // Verify student is enrolled in the course
        if ($assignment && $role === 'student') {
            $stmtEnroll = $db->prepare("SELECT id FROM enrollments WHERE user_id = ? AND course_id = ? AND completion_status = 'Active'");
            $stmtEnroll->execute([$studentId, (int)$assignment['course_id']]);
            if (!$stmtEnroll->fetch()) {
                $errors['student_id'] = "Student is not active/enrolled in the course for this assignment.";
            }
        }
    }

    // 3. File Path validation
    $filePath = isset($data['file_path']) ? trim((string)$data['file_path']) : '';
    if (empty($filePath)) {
        $errors['file_path'] = "Submission file path or URL is required.";
    } elseif (strlen($filePath) > 255) {
        $errors['file_path'] = "File path cannot exceed 255 characters.";
    }

    // 4. Duplicate submission check (One active submission per student per assignment)
    if ($assignmentId > 0 && $studentId > 0 && empty($errors)) {
        $stmtDup = $db->prepare("SELECT id FROM assignment_submissions WHERE assignment_id = ? AND student_id = ?");
        $stmtDup->execute([$assignmentId, $studentId]);
        if ($stmtDup->fetch()) {
            $errors['duplicate'] = "A submission already exists for this student and assignment.";
        }
    }

    return $errors;
}

function validateGrading(array $data, int $maxMarks): array {
    $errors = [];

    // 1. Status validation
    if (!isset($data['status'])) {
        $errors['status'] = "Grading status is required.";
    } else {
        $status = trim((string)$data['status']);
        if (!in_array($status, ['Submitted', 'Under Review', 'Graded', 'Revision Requested'])) {
            $errors['status'] = "Grading status must be 'Submitted', 'Under Review', 'Graded', or 'Revision Requested'.";
        }
    }

    // 2. Marks validation
    if (isset($data['status']) && $data['status'] === 'Graded') {
        if (!isset($data['marks']) || $data['marks'] === '' || $data['marks'] === null) {
            $errors['marks'] = "Marks are required for status 'Graded'.";
        } else {
            $marks = $data['marks'];
            if (!is_numeric($marks) || (int)$marks < 0 || (int)$marks > $maxMarks) {
                $errors['marks'] = "Marks must be an integer between 0 and the assignment maximum of {$maxMarks}.";
            }
        }
    } else {
        if (isset($data['marks']) && $data['marks'] !== '' && $data['marks'] !== null) {
            $marks = $data['marks'];
            if (!is_numeric($marks) || (int)$marks < 0 || (int)$marks > $maxMarks) {
                $errors['marks'] = "Marks must be an integer between 0 and the assignment maximum of {$maxMarks}.";
            }
        }
    }

    // 3. Feedback validation
    if (isset($data['feedback']) && $data['feedback'] !== null) {
        $feedback = trim((string)$data['feedback']);
        if (strlen($feedback) > 10000) {
            $errors['feedback'] = "Feedback cannot exceed 10000 characters.";
        }
    }

    // 4. Graded By validation
    if (isset($data['graded_by'])) {
        $gradedBy = (int)$data['graded_by'];
        if ($gradedBy <= 0) {
            $errors['graded_by'] = "Invalid grader ID.";
        } else {
            $db = Database::getConnection();
            $stmt = $db->prepare("SELECT role FROM users WHERE id = ?");
            $stmt->execute([$gradedBy]);
            $role = $stmt->fetchColumn();
            if (!$role) {
                $errors['graded_by'] = "Referenced grader does not exist.";
            } elseif (!in_array($role, ['super_admin', 'admin', 'instructor'])) {
                $errors['graded_by'] = "Only instructors and administrators can grade submissions.";
            }
        }
    }

    return $errors;
}

/**
 * Validates category data (for creation or update)
 * 
 * @param array $data Input request data
 * @param bool $isUpdate True if editing an existing category
 * @param int|null $categoryId The ID of the category being updated (needed for uniqueness check)
 * @return array Array of errors. Empty if data is valid.
 */
function validateCategory(array $data, bool $isUpdate = false, ?int $categoryId = null): array {
    $errors = [];
    $db = Database::getConnection();

    // 1. Name validation
    if (!$isUpdate || isset($data['name'])) {
        $name = isset($data['name']) ? trim(strip_tags((string)$data['name'])) : '';
        if (empty($name)) {
            $errors['name'] = "Category name is required and cannot be empty.";
        } elseif (strlen($name) > 100) {
            $errors['name'] = "Category name cannot exceed 100 characters.";
        }
    }

    // 2. Slug validation
    if (isset($data['slug'])) {
        $slug = trim((string)$data['slug']);
        if (empty($slug) && !$isUpdate) {
            $errors['slug'] = "Category slug cannot be empty.";
        } elseif (!empty($slug)) {
            if (strlen($slug) > 100) {
                $errors['slug'] = "Category slug cannot exceed 100 characters.";
            } elseif (!preg_match('/^[a-z0-9\-]+$/', $slug)) {
                $errors['slug'] = "Category slug must contain only lowercase letters, numbers, and hyphens.";
            } else {
                // Check slug uniqueness
                $sql = "SELECT id FROM categories WHERE slug = ?";
                $params = [$slug];
                if ($isUpdate && $categoryId) {
                    $sql .= " AND id != ?";
                    $params[] = $categoryId;
                }
                $stmt = $db->prepare($sql);
                $stmt->execute($params);
                if ($stmt->fetch()) {
                    $errors['slug'] = "A category with this slug already exists.";
                }
            }
        }
    }

    // 3. Icon validation
    if (isset($data['icon'])) {
        $icon = trim(strip_tags((string)$data['icon']));
        if (strlen($icon) > 50) {
            $errors['icon'] = "Icon class name cannot exceed 50 characters.";
        }
    }

    // 4. Image validation
    if (isset($data['image']) && $data['image'] !== null) {
        $image = trim((string)$data['image']);
        if (strlen($image) > 255) {
            $errors['image'] = "Image path/URL cannot exceed 255 characters.";
        }
    }

    // 5. Status validation
    if (isset($data['status'])) {
        $status = trim((string)$data['status']);
        if (!in_array($status, ['Active', 'Inactive'])) {
            $errors['status'] = "Status must be 'Active' or 'Inactive'.";
        }
    }

    // 6. Sort Order validation
    if (isset($data['sort_order'])) {
        $sortOrder = $data['sort_order'];
        if (!is_numeric($sortOrder) || (int)$sortOrder < 0) {
            $errors['sort_order'] = "Sort order must be a non-negative integer.";
        }
    }

    return $errors;
}

