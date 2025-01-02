<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Room Controller
 * 
 * Handles all room management operations including:
 * - Listing all rooms
 * - Creating new rooms
 * - Editing existing rooms
 * - Deleting rooms
 * - Managing room status
 */
class Room extends CI_Controller {
    
    /**
     * Constructor
     * 
     * Loads required models and helpers
     */
    public function __construct() {
        parent::__construct();
        $this->load->model('RoomModel');
        $this->load->library('form_validation');
        $this->load->helper('form');
    }

    /**
     * Display list of all rooms
     */
    public function index() {
        $data['rooms'] = $this->RoomModel->getAll();
        
        $this->load->view('templates/header');
        $this->load->view('room/list', $data);
        $this->load->view('templates/footer');
    }

    /**
     * Display room creation form
     */
    public function create() {
        $this->load->view('templates/header');
        $this->load->view('room/create');
        $this->load->view('templates/footer');
    }

    /**
     * Store new room data
     * 
     * Validates and stores new room information
     */
    public function store() {
        // Set validation rules
        $this->_setValidationRules();

        if ($this->form_validation->run() == FALSE) {
            // If validation fails, return to form with errors
            $this->load->view('templates/header');
            $this->load->view('room/create');
            $this->load->view('templates/footer');
        } else {
            // Prepare room data
            $roomData = array(
                'number' => $this->input->post('number'),
                'type' => $this->input->post('type'),
                'price' => $this->input->post('price'),
                'status' => $this->input->post('status'),
                'facilities' => $this->input->post('facilities')
            );

            // Save room data
            if ($this->RoomModel->create($roomData)) {
                $this->session->set_flashdata('success', 'Kamar berhasil ditambahkan');
                redirect('room');
            } else {
                $this->session->set_flashdata('error', 'Gagal menambahkan kamar');
                redirect('room/create');
            }
        }
    }

    /**
     * Display room edit form
     * 
     * @param int $id Room ID
     */
    public function edit($id) {
        $data['room'] = $this->RoomModel->getById($id);
        
        if (!$data['room']) {
            show_404();
        }

        $this->load->view('templates/header');
        $this->load->view('room/edit', $data);
        $this->load->view('templates/footer');
    }

    /**
     * Update room data
     * 
     * @param int $id Room ID
     */
    public function update($id) {
        // Set validation rules
        $this->_setValidationRules();

        if ($this->form_validation->run() == FALSE) {
            // If validation fails, return to form with errors
            $data['room'] = $this->RoomModel->getById($id);
            $this->load->view('templates/header');
            $this->load->view('room/edit', $data);
            $this->load->view('templates/footer');
        } else {
            // Prepare room data
            $roomData = array(
                'number' => $this->input->post('number'),
                'type' => $this->input->post('type'),
                'price' => $this->input->post('price'),
                'status' => $this->input->post('status'),
                'facilities' => $this->input->post('facilities')
            );

            // Update room data
            if ($this->RoomModel->update($id, $roomData)) {
                $this->session->set_flashdata('success', 'Kamar berhasil diupdate');
                redirect('room');
            } else {
                $this->session->set_flashdata('error', 'Gagal mengupdate kamar');
                redirect('room/edit/' . $id);
            }
        }
    }

    /**
     * Delete room
     * 
     * @param int $id Room ID
     */
    public function delete($id) {
        if ($this->RoomModel->delete($id)) {
            $this->session->set_flashdata('success', 'Kamar berhasil dihapus');
        } else {
            $this->session->set_flashdata('error', 'Gagal menghapus kamar');
        }
        redirect('room');
    }

    /**
     * Set form validation rules
     * 
     * Private method to set validation rules for room form
     */
    private function _setValidationRules() {
        $this->form_validation->set_rules('number', 'Nomor Kamar', 'required|min_length[2]|is_unique[rooms.number]');
        $this->form_validation->set_rules('type', 'Tipe Kamar', 'required');
        $this->form_validation->set_rules('price', 'Harga', 'required|numeric|greater_than[0]');
        $this->form_validation->set_rules('status', 'Status', 'required|in_list[available,occupied,dirty]');
    }
}
