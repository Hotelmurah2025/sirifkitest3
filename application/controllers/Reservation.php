<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Reservation extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('ReservationModel');
        $this->load->model('RoomModel');
        $this->load->model('GuestModel');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('reservation/list');
        $this->load->view('templates/footer');
    }

    public function create() {
        $this->load->view('templates/header');
        $this->load->view('reservation/create');
        $this->load->view('templates/footer');
    }

    public function store() {
        // Reservation creation logic will be implemented here
    }

    public function checkIn($id) {
        // Check-in logic will be implemented here
    }

    public function checkOut($id) {
        // Check-out logic will be implemented here
    }
}
