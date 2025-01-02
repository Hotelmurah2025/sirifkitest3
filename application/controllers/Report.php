<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Report extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('ReportModel');
    }

    public function daily() {
        $this->load->view('templates/header');
        $this->load->view('report/daily');
        $this->load->view('templates/footer');
    }

    public function monthly() {
        $this->load->view('templates/header');
        $this->load->view('report/monthly');
        $this->load->view('templates/footer');
    }

    public function occupancy() {
        $this->load->view('templates/header');
        $this->load->view('report/occupancy');
        $this->load->view('templates/footer');
    }
}
