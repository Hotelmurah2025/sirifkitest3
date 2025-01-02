<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Auth extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('UserModel');
    }

    public function index() {
        $this->load->view('templates/header');
        $this->load->view('auth/login');
        $this->load->view('templates/footer');
    }

    public function login() {
        // Login logic will be implemented here
    }

    public function logout() {
        // Logout logic will be implemented here
    }
}
