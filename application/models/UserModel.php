<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class UserModel extends CI_Model {
    private $table = 'users';

    public function __construct() {
        parent::__construct();
        $this->load->database();
    }

    /**
     * Authenticate user
     * @param string $username
     * @param string $password
     * @return array|bool User data if authenticated, false otherwise
     */
    public function authenticate($username, $password) {
        $user = $this->db->get_where($this->table, ['username' => $username])->row_array();
        
        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']); // Remove password from array
            return $user;
        }
        
        return false;
    }

    /**
     * Create new user
     * @param array $data User data
     * @return bool Success status
     */
    public function create($data) {
        // Hash password
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        return $this->db->insert($this->table, $data);
    }

    /**
     * Get user by ID
     * @param int $id User ID
     * @return array|null User data
     */
    public function get($id) {
        $user = $this->db->get_where($this->table, ['id' => $id])->row_array();
        if ($user) {
            unset($user['password']); // Remove password from array
        }
        return $user;
    }

    /**
     * Get all users
     * @param string|null $role Filter by role
     * @return array List of users
     */
    public function get_all($role = null) {
        if ($role) {
            $this->db->where('role', $role);
        }
        
        $users = $this->db->get($this->table)->result_array();
        
        // Remove passwords from results
        foreach ($users as &$user) {
            unset($user['password']);
        }
        
        return $users;
    }

    /**
     * Update user
     * @param int $id User ID
     * @param array $data Updated data
     * @return bool Success status
     */
    public function update($id, $data) {
        // Hash password if it's being updated
        if (isset($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }
        
        $this->db->where('id', $id);
        return $this->db->update($this->table, $data);
    }

    /**
     * Delete user
     * @param int $id User ID
     * @return bool Success status
     */
    public function delete($id) {
        return $this->db->delete($this->table, ['id' => $id]);
    }

    /**
     * Change user password
     * @param int $id User ID
     * @param string $old_password Current password
     * @param string $new_password New password
     * @return bool Success status
     */
    public function change_password($id, $old_password, $new_password) {
        $user = $this->db->get_where($this->table, ['id' => $id])->row_array();
        
        if ($user && password_verify($old_password, $user['password'])) {
            $this->db->where('id', $id);
            return $this->db->update($this->table, [
                'password' => password_hash($new_password, PASSWORD_DEFAULT)
            ]);
        }
        
        return false;
    }

    /**
     * Check if username exists
     * @param string $username Username to check
     * @param int|null $exclude_id Exclude user ID from check (for updates)
     * @return bool True if username exists
     */
    public function username_exists($username, $exclude_id = null) {
        if ($exclude_id) {
            $this->db->where('id !=', $exclude_id);
        }
        
        return $this->db->get_where($this->table, ['username' => $username])->num_rows() > 0;
    }

    /**
     * Get user by role
     * @param string $role User role
     * @return array List of users with specified role
     */
    public function get_by_role($role) {
        return $this->db->get_where($this->table, ['role' => $role])->result_array();
    }

    /**
     * Count users by role
     * @param string|null $role Role to count (optional)
     * @return int Number of users
     */
    public function count_users($role = null) {
        if ($role) {
            $this->db->where('role', $role);
        }
        return $this->db->count_all_results($this->table);
    }
}
