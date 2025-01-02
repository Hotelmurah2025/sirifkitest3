<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Guest extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('GuestModel');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('guest/list');
        $this->load->view('templates/footer');
    }

    public function show($id) {
        $this->load->view('templates/header');
        $this->load->view('guest/show');
        $this->load->view('templates/footer');
    }

    public function history($id) {
        $this->load->view('templates/header');
        $this->load->view('guest/history');
        $this->load->view('templates/footer');
    }
}
