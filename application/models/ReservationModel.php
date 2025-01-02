<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class ReservationModel extends CI_Model {
    protected $table = 'reservations';

    public function __construct() {
        parent::__construct();
    }

    public function getAll() {
        return $this->db->get($this->table)->result();
    }

    public function getById($id) {
        return $this->db->get_where($this->table, ['id' => $id])->row();
    }

    public function create($data) {
        return $this->db->insert($this->table, $data);
    }

    public function update($id, $data) {
        return $this->db->update($this->table, $data, ['id' => $id]);
    }
}
