<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Room extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('RoomModel');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('room/list');
        $this->load->view('templates/footer');
    }

    public function create() {
        // Room creation logic will be implemented here
    }

    public function store() {
        // Store room data logic will be implemented here
    }

    public function edit($id) {
        // Room edit logic will be implemented here
    }

    public function update($id) {
        // Update room logic will be implemented here
    }

    public function delete($id) {
        // Delete room logic will be implemented here
    }
}
