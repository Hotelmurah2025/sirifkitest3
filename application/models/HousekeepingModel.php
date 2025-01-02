<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class HousekeepingModel extends CI_Model {
    protected $table = 'housekeeping';

    public function __construct() {
        parent::__construct();
    }

    public function getSchedule($date) {
        $this->db->where('scheduled_date', $date);
        return $this->db->get($this->table)->result();
    }

    public function updateStatus($id, $status) {
        return $this->db->update($this->table, ['status' => $status], ['id' => $id]);
    }
}
