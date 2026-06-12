<?php
/**
 * GET /api/my-courses
 * List enrolled courses for current authenticated student
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires general authentication
$currentUser = requireAuth();

try {
    $db = Database::getConnection();
    
    // Select all enrollments for this user, joining courses and categories
    $stmt = $db->prepare("
        SELECT 
            e.id AS enrollment_id,
            e.progress,
            e.status,
            e.enrolled_at,
            e.completed_at,
            e.created_at,
            e.updated_at,
            e.completion_status,
            e.certificate_issued,
            e.enrollment_date,
            c.id AS course_id,
            c.title,
            c.slug,
            c.description,
            c.thumbnail,
            c.mentor_name,
            c.duration,
            c.price,
            cat.name AS category_name,
            (
                SELECT COUNT(l.id) 
                FROM lectures l 
                JOIN course_modules m ON l.module_id = m.id 
                WHERE m.course_id = c.id
            ) AS total_lectures
        FROM enrollments e
        JOIN courses c ON e.course_id = c.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        WHERE e.user_id = ?
        ORDER BY e.enrollment_date DESC
    ");
    
    $stmt->execute([$currentUser['id']]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $myCourses = [];
    foreach ($results as $row) {
        // Map premium thumbnails if using short color keys
        $image = $row['thumbnail'];
        if ($image === 'grad-violet') {
            $image = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800";
        } elseif ($image === 'grad-blue') {
            $image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800";
        } elseif (empty($image)) {
            $image = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800";
        }
        
        // Map instructor details dynamically based on name
        $instructorRole = "RE Academy Mentor";
        $instructorAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100";
        if (stripos($row['mentor_name'], 'Sarah') !== false) {
            $instructorRole = "Behavioral Sales Coach";
            $instructorAvatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100";
        } elseif (stripos($row['mentor_name'], 'Robert') !== false || stripos($row['mentor_name'], 'Sterling') !== false) {
            $instructorRole = "High-Ticket Sales Veteran";
            $instructorAvatar = "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=100";
        } elseif (stripos($row['mentor_name'], 'Alex') !== false) {
            $instructorRole = "CRE Acquisition Expert";
            $instructorAvatar = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100";
        } elseif (stripos($row['mentor_name'], 'Elena') !== false) {
            $instructorRole = "Ultra-Luxury Broker";
            $instructorAvatar = "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=100";
        }

        $myCourses[] = [
            'id' => (int)$row['course_id'],
            'enrollment_id' => (int)$row['enrollment_id'],
            'title' => $row['title'],
            'subtitle' => $row['description'],
            'instructor' => $row['mentor_name'],
            'instructorRole' => $instructorRole,
            'instructorAvatar' => $instructorAvatar,
            'category' => $row['category_name'] ?? 'General',
            'specializationBadge' => $row['category_name'] ?? 'General',
            'progress' => (int)$row['progress'],
            'duration' => $row['duration'] ?? '12 Hours',
            'lessons' => (int)$row['total_lectures'],
            'status' => $row['status'],
            'enrolled_at' => $row['enrolled_at'],
            'completed_at' => $row['completed_at'],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at'],
            'completion_status' => $row['completion_status'],
            'isPremium' => $row['price'] > 0,
            'image' => $image,
            'description' => $row['description'],
            'enrollment_date' => $row['enrollment_date'],
            'certificate_issued' => (int)$row['certificate_issued']
        ];
    }
    
    sendResponse(200, $myCourses, "My courses retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
