<?php
/**
 * GET /api/payments/my-purchases
 * List course purchase orders (transactions) for current authenticated student
 */

require_once __DIR__ . '/../../config/db.php';
require_once __DIR__ . '/../../helpers/response.php';
require_once __DIR__ . '/../../middleware/auth_middleware.php';

// Requires student/user authentication
$currentUser = requireAuth();

try {
    $db = Database::getConnection();
    
    // Select all orders for this user, joining courses, categories, and active enrollments
    $stmt = $db->prepare("
        SELECT 
            o.id AS order_id,
            o.amount,
            o.currency,
            o.status AS payment_status,
            o.created_at AS purchase_date,
            o.razorpay_order_id,
            o.razorpay_payment_id,
            o.failure_reason,
            c.id AS course_id,
            c.title AS course_title,
            c.description AS course_description,
            c.thumbnail AS course_thumbnail,
            c.mentor_name,
            c.duration,
            c.price AS course_price,
            cat.name AS category_name,
            e.id AS enrollment_id,
            e.progress AS course_progress,
            e.completion_status
        FROM orders o
        JOIN courses c ON o.course_id = c.id
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN enrollments e ON e.user_id = o.user_id AND e.course_id = o.course_id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    ");
    
    $stmt->execute([$currentUser['id']]);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $purchases = [];
    foreach ($results as $row) {
        // Map premium thumbnails if using short color keys
        $image = $row['course_thumbnail'];
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

        $purchases[] = [
            'order_id' => (int)$row['order_id'],
            'amount' => (float)$row['amount'],
            'currency' => $row['currency'],
            'payment_status' => $row['payment_status'],
            'purchase_date' => $row['purchase_date'],
            'razorpay_order_id' => $row['razorpay_order_id'],
            'razorpay_payment_id' => $row['razorpay_payment_id'],
            'failure_reason' => $row['failure_reason'],
            'course' => [
                'id' => (int)$row['course_id'],
                'title' => $row['course_title'],
                'description' => $row['course_description'],
                'thumbnail' => $image,
                'mentor_name' => $row['mentor_name'],
                'instructorRole' => $instructorRole,
                'instructorAvatar' => $instructorAvatar,
                'duration' => $row['duration'] ?? '12 Hours',
                'price' => (float)$row['course_price'],
                'category_name' => $row['category_name'] ?? 'General',
            ],
            'enrollment' => $row['enrollment_id'] ? [
                'id' => (int)$row['enrollment_id'],
                'progress' => (int)$row['course_progress'],
                'completion_status' => $row['completion_status'],
            ] : null
        ];
    }
    
    sendResponse(200, $purchases, "My purchases retrieved successfully.");
} catch (PDOException $e) {
    sendResponse(500, null, "Database Error: " . $e->getMessage());
}
