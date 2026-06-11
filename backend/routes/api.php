<?php
/**
 * REST API Route Registry for BG Realty Training Academy LMS
 */

// Array map connecting "HTTP_METHOD /api/endpoint" to handler script paths
return [
    'GET /api/health' => 'api/health.php',
    'POST /api/auth/signup' => 'api/auth/signup.php',
    'POST /api/auth/login' => 'api/auth/login.php',
    'GET /api/auth/validate' => 'api/auth/validate.php',
    'POST /api/auth/google' => 'api/auth/google.php',
    'POST /api/auth/logout' => 'api/auth/logout.php',
    
    // Categories APIs
    'GET /api/categories' => 'api/categories/list.php',
    'GET /api/categories/{id}' => 'api/categories/get.php',
    'POST /api/categories' => 'api/categories/create.php',
    'PUT /api/categories/{id}' => 'api/categories/update.php',
    'DELETE /api/categories/{id}' => 'api/categories/delete.php',

    // Courses APIs
    'GET /api/courses' => 'api/courses/list.php',
    'GET /api/courses/{id}' => 'api/courses/get.php',
    'POST /api/courses' => 'api/courses/create.php',
    'PUT /api/courses/{id}' => 'api/courses/update.php',
    'DELETE /api/courses/{id}' => 'api/courses/delete.php',

    // Course Modules APIs
    'GET /api/courses/{course_id}/modules'       => 'api/modules/list.php',
    'GET /api/courses/{course_id}/modules/{id}'  => 'api/modules/get.php',
    'POST /api/courses/{course_id}/modules'      => 'api/modules/create.php',
    'PUT /api/courses/{course_id}/modules/{id}'  => 'api/modules/update.php',
    'DELETE /api/courses/{course_id}/modules/{id}' => 'api/modules/delete.php',
    'POST /api/courses/{course_id}/modules/reorder' => 'api/modules/reorder.php',

    // Lecture APIs
    'POST /api/modules/{module_id}/lectures' => 'api/lectures/create.php',
    'PUT /api/modules/{module_id}/lectures/{id}' => 'api/lectures/update.php',
    'DELETE /api/modules/{module_id}/lectures/{id}' => 'api/lectures/delete.php',
    'POST /api/modules/{module_id}/lectures/reorder' => 'api/lectures/reorder.php',

    // Enrollment APIs
    'POST /api/enrollments' => 'api/enrollments/create.php',
    'GET /api/my-courses' => 'api/enrollments/my_courses.php',
    'GET /api/enrollments/{id}' => 'api/enrollments/get.php',
    'PUT /api/enrollments/{id}' => 'api/enrollments/update.php',

    // Assignments APIs
    'POST /api/assignments' => 'api/assignments/create.php',
    'GET /api/assignments' => 'api/assignments/list.php',
    'GET /api/assignments/{id}' => 'api/assignments/get.php',
    'PUT /api/assignments/{id}' => 'api/assignments/update.php',
    'DELETE /api/assignments/{id}' => 'api/assignments/delete.php',

    // Assignment Submissions APIs
    'POST /api/assignments/{id}/submit' => 'api/assignments/submit.php',
    'DELETE /api/assignments/{id}/submit' => 'api/assignments/delete_submission.php',
    'GET /api/submissions/my' => 'api/submissions/my.php',
    'GET /api/submissions/{id}' => 'api/submissions/get.php',
    'POST /api/submissions/{id}/grade' => 'api/submissions/grade.php',
    'GET /api/submissions/course/{course_id}' => 'api/submissions/course.php',
    'GET /api/submissions' => 'api/submissions/list.php',

    // Announcements APIs
    'GET /api/announcements' => 'api/announcements/list.php',
    'POST /api/announcements' => 'api/announcements/create.php',
    'DELETE /api/announcements/{id}' => 'api/announcements/delete.php',

    // Resources APIs
    'GET /api/courses/{course_id}/resources' => 'api/resources/list.php',
    'POST /api/courses/{course_id}/resources' => 'api/resources/create.php',
    'DELETE /api/courses/{course_id}/resources/{id}' => 'api/resources/delete.php',

    // Lecture Progress APIs
    'POST /api/lectures/{lecture_id}/progress' => 'api/lectures/progress_update.php',
    'GET /api/lectures/{lecture_id}/progress' => 'api/lectures/progress_get.php',

    // Webinars / Live Classes APIs
    'GET /api/webinars' => 'api/webinars/list.php',
    'POST /api/webinars' => 'api/webinars/create.php',
    'PUT /api/webinars/{id}' => 'api/webinars/update.php',
    'DELETE /api/webinars/{id}' => 'api/webinars/delete.php',

    // Notifications APIs
    'GET /api/notifications' => 'api/notifications/list.php',
    'POST /api/notifications/{id}/read' => 'api/notifications/read.php',
    'POST /api/notifications/read-all' => 'api/notifications/read_all.php',
    'DELETE /api/notifications/{id}' => 'api/notifications/delete.php',

    // Certificates APIs
    'GET /api/certificates' => 'api/certificates/list.php',
    'POST /api/certificates/generate' => 'api/certificates/generate.php',

    // Dashboard Stats APIs
    'GET /api/dashboard/stats' => 'api/dashboard/stats.php',
];

