<?php
/**
 * Category Model for RealEstate LMS
 */

require_once __DIR__ . '/../config/db.php';

class Category {

    /**
     * Create a new course category
     * 
     * @param array $data
     * @return int The newly created category ID
     * @throws PDOException
     */
    public static function create(array $data): int {
        $db = Database::getConnection();
        
        $sql = "INSERT INTO categories (name, slug, description, image, icon, status, sort_order) 
                VALUES (?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $db->prepare($sql);
        $stmt->execute([
            trim(strip_tags((string)$data['name'])),
            trim((string)$data['slug']),
            isset($data['description']) ? trim(strip_tags((string)$data['description'])) : null,
            isset($data['image']) ? trim((string)$data['image']) : null,
            isset($data['icon']) ? trim(strip_tags((string)$data['icon'])) : 'Layers',
            isset($data['status']) ? trim((string)$data['status']) : 'Active',
            isset($data['sort_order']) ? (int)$data['sort_order'] : 0
        ]);
        
        return (int)$db->lastInsertId();
    }

    /**
     * Update an existing course category
     * 
     * @param int $id
     * @param array $data
     * @return bool True on success, false on failure
     * @throws PDOException
     */
    public static function update(int $id, array $data): bool {
        $db = Database::getConnection();
        
        $existing = self::findById($id);
        if (!$existing) {
            return false;
        }
        
        $sql = "UPDATE categories 
                SET name = ?, slug = ?, description = ?, image = ?, icon = ?, status = ?, sort_order = ?
                WHERE id = ?";
        
        $stmt = $db->prepare($sql);
        return $stmt->execute([
            isset($data['name']) ? trim(strip_tags((string)$data['name'])) : $existing['name'],
            isset($data['slug']) ? trim((string)$data['slug']) : $existing['slug'],
            array_key_exists('description', $data) ? (trim(strip_tags((string)$data['description'])) ?: null) : $existing['description'],
            array_key_exists('image', $data) ? (trim((string)$data['image']) ?: null) : $existing['image'],
            isset($data['icon']) ? trim(strip_tags((string)$data['icon'])) : $existing['icon'],
            isset($data['status']) ? trim((string)$data['status']) : $existing['status'],
            isset($data['sort_order']) ? (int)$data['sort_order'] : (int)$existing['sort_order'],
            $id
        ]);
    }

    /**
     * Delete a category
     * 
     * @param int $id
     * @return bool True on success
     * @throws PDOException
     */
    public static function delete(int $id): bool {
        $db = Database::getConnection();
        $stmt = $db->prepare("DELETE FROM categories WHERE id = ?");
        return $stmt->execute([$id]);
    }

    /**
     * Find category by ID
     * 
     * @param int $id
     * @return array|null
     * @throws PDOException
     */
    public static function findById(int $id): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, slug, description, image, icon, status, sort_order, created_at, updated_at FROM categories WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            $result['id'] = (int)$result['id'];
            $result['sort_order'] = (int)$result['sort_order'];
            return $result;
        }
        
        return null;
    }

    /**
     * Find category by Slug
     * 
     * @param string $slug
     * @return array|null
     * @throws PDOException
     */
    public static function findBySlug(string $slug): ?array {
        $db = Database::getConnection();
        $stmt = $db->prepare("SELECT id, name, slug, description, image, icon, status, sort_order, created_at, updated_at FROM categories WHERE slug = ?");
        $stmt->execute([$slug]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result) {
            $result['id'] = (int)$result['id'];
            $result['sort_order'] = (int)$result['sort_order'];
            return $result;
        }
        
        return null;
    }

    /**
     * Get all categories with optional search, pagination
     * 
     * @param bool $activeOnly If true, only retrieve 'Active' status categories
     * @param string|null $search Search term (matching name or description)
     * @param int|null $page Page number
     * @param int|null $limit Items per page
     * @return array
     * @throws PDOException
     */
    public static function findAll(bool $activeOnly = false, ?string $search = null, ?int $page = null, ?int $limit = null): array {
        $db = Database::getConnection();
        
        $conditions = [];
        $params = [];
        
        if ($activeOnly) {
            $conditions[] = "status = 'Active'";
        }
        
        if ($search !== null && $search !== '') {
            $conditions[] = "(name LIKE ? OR description LIKE ?)";
            $searchParam = "%{$search}%";
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        $whereClause = "";
        if (count($conditions) > 0) {
            $whereClause = "WHERE " . implode(" AND ", $conditions);
        }
        
        $sql = "SELECT id, name, slug, description, image, icon, status, sort_order, created_at, updated_at 
                FROM categories 
                $whereClause 
                ORDER BY sort_order ASC, name ASC";
        
        if ($page !== null && $limit !== null && $page > 0 && $limit > 0) {
            $offset = ($page - 1) * $limit;
            $sql .= " LIMIT ? OFFSET ?";
        }
        
        $stmt = $db->prepare($sql);
        
        // Bind parameters
        $paramIndex = 1;
        foreach ($params as $param) {
            $stmt->bindValue($paramIndex++, $param);
        }
        
        if ($page !== null && $limit !== null && $page > 0 && $limit > 0) {
            $stmt->bindValue($paramIndex++, $limit, PDO::PARAM_INT);
            $stmt->bindValue($paramIndex++, $offset, PDO::PARAM_INT);
        }
        
        $stmt->execute();
        
        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($results as &$r) {
            $r['id'] = (int)$r['id'];
            $r['sort_order'] = (int)$r['sort_order'];
        }
        
        return $results;
    }

    /**
     * Count all categories with optional search
     * 
     * @param bool $activeOnly If true, only count 'Active' status categories
     * @param string|null $search Search term (matching name or description)
     * @return int
     * @throws PDOException
     */
    public static function countAll(bool $activeOnly = false, ?string $search = null): int {
        $db = Database::getConnection();
        
        $conditions = [];
        $params = [];
        
        if ($activeOnly) {
            $conditions[] = "status = 'Active'";
        }
        
        if ($search !== null && $search !== '') {
            $conditions[] = "(name LIKE ? OR description LIKE ?)";
            $searchParam = "%{$search}%";
            $params[] = $searchParam;
            $params[] = $searchParam;
        }
        
        $whereClause = "";
        if (count($conditions) > 0) {
            $whereClause = "WHERE " . implode(" AND ", $conditions);
        }
        
        $sql = "SELECT COUNT(*) FROM categories $whereClause";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        
        return (int)$stmt->fetchColumn();
    }
}
