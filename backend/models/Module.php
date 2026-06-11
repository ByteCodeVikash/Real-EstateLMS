<?php
/**
 * Module Model
 *
 * Encapsulates all database interactions for the `course_modules` table.
 * Schema: id, course_id, title, description, sort_order, status,
 *         lectures (legacy JSON), created_at, updated_at
 */

require_once __DIR__ . '/../config/db.php';

class Module
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    // -------------------------------------------------------------------------
    // READ
    // -------------------------------------------------------------------------

    /**
     * Get all modules for a course ordered by sort_order.
     *
     * @param int    $courseId
     * @param string $status   Optional status filter ('Published', 'Draft', 'Archived')
     * @return array
     */
    public function getByCourse(int $courseId, string $status = ''): array
    {
        if ($status !== '') {
            $stmt = $this->db->prepare(
                "SELECT id, course_id, title, description, sort_order, status, created_at, updated_at
                 FROM course_modules
                 WHERE course_id = ? AND status = ?
                 ORDER BY sort_order ASC"
            );
            $stmt->execute([$courseId, $status]);
        } else {
            $stmt = $this->db->prepare(
                "SELECT id, course_id, title, description, sort_order, status, created_at, updated_at
                 FROM course_modules
                 WHERE course_id = ?
                 ORDER BY sort_order ASC"
            );
            $stmt->execute([$courseId]);
        }

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Get a single module by ID.
     *
     * @param int $id
     * @return array|null
     */
    public function getById(int $id): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, course_id, title, description, sort_order, status, created_at, updated_at
             FROM course_modules
             WHERE id = ?"
        );
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    /**
     * Get a module by ID and course ID (validates course ownership).
     *
     * @param int $id
     * @param int $courseId
     * @return array|null
     */
    public function getByIdAndCourse(int $id, int $courseId): ?array
    {
        $stmt = $this->db->prepare(
            "SELECT id, course_id, title, description, sort_order, status, created_at, updated_at
             FROM course_modules
             WHERE id = ? AND course_id = ?"
        );
        $stmt->execute([$id, $courseId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ?: null;
    }

    // -------------------------------------------------------------------------
    // WRITE
    // -------------------------------------------------------------------------

    /**
     * Create a new module.
     * Automatically assigns the next sort_order within the course.
     *
     * @param int    $courseId
     * @param string $title
     * @param string $description
     * @param string $status
     * @return int   New module ID
     */
    public function create(int $courseId, string $title, string $description = '', string $status = 'Draft'): int
    {
        // Calculate next sort order
        $sortStmt = $this->db->prepare(
            "SELECT COALESCE(MAX(sort_order), 0) + 1 FROM course_modules WHERE course_id = ?"
        );
        $sortStmt->execute([$courseId]);
        $nextSort = (int) $sortStmt->fetchColumn();

        $stmt = $this->db->prepare(
            "INSERT INTO course_modules (course_id, title, description, sort_order, status)
             VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$courseId, $title, $description ?: null, $nextSort, $status]);

        return (int) $this->db->lastInsertId();
    }

    /**
     * Update a module's editable fields.
     *
     * @param int    $id
     * @param string $title
     * @param string $description
     * @param string $status
     * @return bool
     */
    public function update(int $id, string $title, string $description = '', string $status = 'Draft'): bool
    {
        $stmt = $this->db->prepare(
            "UPDATE course_modules
             SET title = ?, description = ?, status = ?
             WHERE id = ?"
        );
        return $stmt->execute([$title, $description ?: null, $status, $id]);
    }

    /**
     * Delete a module by ID.
     *
     * @param int $id
     * @return bool
     */
    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("DELETE FROM course_modules WHERE id = ?");
        return $stmt->execute([$id]);
    }

    // -------------------------------------------------------------------------
    // ORDERING
    // -------------------------------------------------------------------------

    /**
     * Reorder modules using an ordered list of IDs.
     * Assigns sort_order 1, 2, 3… based on array position.
     *
     * @param int   $courseId
     * @param int[] $orderedIds  Array of module IDs in desired order
     * @return void
     * @throws PDOException on failure (caller should handle rollback)
     */
    public function reorderByIds(int $courseId, array $orderedIds): void
    {
        $stmt = $this->db->prepare(
            "UPDATE course_modules SET sort_order = ? WHERE id = ? AND course_id = ?"
        );
        $sort = 1;
        foreach ($orderedIds as $id) {
            $stmt->execute([$sort++, (int) $id, $courseId]);
        }
    }

    /**
     * Reorder modules using an array of {id, sort_order} pairs.
     *
     * @param int   $courseId
     * @param array $orders    Array of ['id' => int, 'sort_order' => int]
     * @return void
     */
    public function reorderByPairs(int $courseId, array $orders): void
    {
        $stmt = $this->db->prepare(
            "UPDATE course_modules SET sort_order = ? WHERE id = ? AND course_id = ?"
        );
        foreach ($orders as $item) {
            $stmt->execute([(int) $item['sort_order'], (int) $item['id'], $courseId]);
        }
    }

    /**
     * Re-index modules sequentially after a deletion (1, 2, 3…).
     *
     * @param int $courseId
     * @return void
     */
    public function reindexAfterDelete(int $courseId): void
    {
        $selectStmt = $this->db->prepare(
            "SELECT id FROM course_modules WHERE course_id = ? ORDER BY sort_order ASC"
        );
        $selectStmt->execute([$courseId]);
        $ids = $selectStmt->fetchAll(PDO::FETCH_COLUMN);

        $updateStmt = $this->db->prepare(
            "UPDATE course_modules SET sort_order = ? WHERE id = ?"
        );
        $sort = 1;
        foreach ($ids as $id) {
            $updateStmt->execute([$sort++, $id]);
        }
    }

    // -------------------------------------------------------------------------
    // UTILITIES
    // -------------------------------------------------------------------------

    /**
     * Cast raw DB row to correct PHP types.
     *
     * @param array $row
     * @return array
     */
    public static function cast(array $row): array
    {
        $row['id']         = (int) $row['id'];
        $row['course_id']  = (int) $row['course_id'];
        $row['sort_order'] = (int) $row['sort_order'];
        return $row;
    }
}
