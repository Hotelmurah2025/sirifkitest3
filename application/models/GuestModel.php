<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class GuestModel extends CI_Model {
    protected $table = 'guests';


    public function __construct() {
        parent::__construct();
    }

    public function getAll() {
        return $this->db->get($this->table)->result();
    }

    public function getById($id) {
        return $this->db->get_where($this->table, ['id' => $id])->row();
    }

    public function getHistory($id) {
        $this->db->where('guest_id', $id);
        return $this->db->get('reservations')->result();
    }
}
