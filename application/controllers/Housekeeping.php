<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Housekeeping extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('HousekeepingModel');
        $this->load->model('RoomModel');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('housekeeping/list');
        $this->load->view('templates/footer');
    }

    public function schedule() {
        $this->load->view('templates/header');
        $this->load->view('housekeeping/schedule');
        $this->load->view('templates/footer');
    }

    public function updateStatus($id) {
        // Status update logic will be implemented here
    }
}
