<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * Reservation Controller
 * 
 * Handles all reservation-related operations including:
 * - Creating and managing reservations
 * - Processing check-in/check-out
 * - Displaying calendar view
 * - Providing calendar event data
 */
class Reservation extends CI_Controller {
    public function __construct() {
        parent::__construct();
        $this->load->model('ReservationModel');
        $this->load->model('RoomModel');
        $this->load->library('form_validation');
    }

    /**
     * Display list of all reservations
     */
    public function index() {
        $data['reservations'] = $this->ReservationModel->getAll();
        $data['title'] = 'Daftar Reservasi';
        
        $this->load->view('templates/header', $data);
        $this->load->view('reservation/list', $data);
        $this->load->view('templates/footer');
    }

    /**
     * Display calendar view
     */
    public function calendar() {
        $data['rooms'] = $this->RoomModel->getAll();
        $data['title'] = 'Kalender Reservasi';
        
        $this->load->view('templates/header', $data);
        $this->load->view('reservation/calendar', $data);
        $this->load->view('templates/footer');
    }

    /**
     * Get calendar events in JSON format
     */
    public function get_calendar_events() {
        $start = $this->input->get('start');
        $end = $this->input->get('end');
        $room_id = $this->input->get('room_id');
        
        $reservations = $this->ReservationModel->getCalendarReservations($start, $end);
        $events = [];
        
        foreach ($reservations as $reservation) {
            if ($room_id && $reservation->room_id != $room_id) {
                continue;
            }
            
            $events[] = [
                'id' => $reservation->id,
                'title' => $reservation->guest_name,
                'start' => $reservation->check_in_date,
                'end' => $reservation->check_out_date,
                'guest_name' => $reservation->guest_name,
                'room_number' => $reservation->room_number,
                'room_type' => $reservation->room_type,
                'status' => $reservation->status,
                'total_price' => $reservation->total_price
            ];
        }
        
        $this->output->set_content_type('application/json')
                     ->set_output(json_encode($events));
    }

    /**
     * Display reservation creation form
     */
    public function create() {
        $data['rooms'] = $this->RoomModel->getAvailableRooms();
        $data['title'] = 'Tambah Reservasi';
        
        $this->load->view('templates/header', $data);
        $this->load->view('reservation/create', $data);
        $this->load->view('templates/footer');
    }

    /**
     * Store new reservation
     */
    public function store() {
        $this->_setValidationRules();
        
        if ($this->form_validation->run() === FALSE) {
            $this->create();
            return;
        }

        // Check room availability
        if (!$this->ReservationModel->isRoomAvailable(
            $this->input->post('room_id'),
            $this->input->post('check_in_date'),
            $this->input->post('check_out_date')
        )) {
            $this->session->set_flashdata('error', 'Kamar tidak tersedia untuk tanggal yang dipilih');
            redirect('reservation/create');
            return;
        }

        $data = [
            'guest_name' => $this->input->post('guest_name'),
            'guest_email' => $this->input->post('guest_email'),
            'guest_phone' => $this->input->post('guest_phone'),
            'room_id' => $this->input->post('room_id'),
            'check_in_date' => $this->input->post('check_in_date'),
            'check_out_date' => $this->input->post('check_out_date'),
            'num_guests' => $this->input->post('num_guests'),
            'notes' => $this->input->post('notes'),
            'status' => 'pending'
        ];

        if ($this->ReservationModel->create($data)) {
            $this->session->set_flashdata('success', 'Reservasi berhasil ditambahkan');
            redirect('reservation');
        } else {
            $this->session->set_flashdata('error', 'Gagal menambahkan reservasi');
            redirect('reservation/create');
        }
    }

    /**
     * Display reservation edit form
     */
    public function edit($id) {
        $data['reservation'] = $this->ReservationModel->getById($id);
        if (!$data['reservation']) {
            show_404();
        }

        $data['rooms'] = $this->RoomModel->getAll();
        $data['title'] = 'Edit Reservasi';
        
        $this->load->view('templates/header', $data);
        $this->load->view('reservation/edit', $data);
        $this->load->view('templates/footer');
    }

    /**
     * Update reservation
     */
    public function update($id) {
        $this->_setValidationRules();
        
        if ($this->form_validation->run() === FALSE) {
            $this->edit($id);
            return;
        }

        // Check room availability (excluding current reservation)
        if (!$this->ReservationModel->isRoomAvailable(
            $this->input->post('room_id'),
            $this->input->post('check_in_date'),
            $this->input->post('check_out_date'),
            $id
        )) {
            $this->session->set_flashdata('error', 'Kamar tidak tersedia untuk tanggal yang dipilih');
            redirect('reservation/edit/' . $id);
            return;
        }

        $data = [
            'guest_name' => $this->input->post('guest_name'),
            'guest_email' => $this->input->post('guest_email'),
            'guest_phone' => $this->input->post('guest_phone'),
            'room_id' => $this->input->post('room_id'),
            'check_in_date' => $this->input->post('check_in_date'),
            'check_out_date' => $this->input->post('check_out_date'),
            'num_guests' => $this->input->post('num_guests'),
            'notes' => $this->input->post('notes')
        ];

        if ($this->ReservationModel->update($id, $data)) {
            $this->session->set_flashdata('success', 'Reservasi berhasil diperbarui');
            redirect('reservation');
        } else {
            $this->session->set_flashdata('error', 'Gagal memperbarui reservasi');
            redirect('reservation/edit/' . $id);
        }
    }

    /**
     * Delete reservation
     */
    public function delete($id) {
        if ($this->ReservationModel->delete($id)) {
            $this->session->set_flashdata('success', 'Reservasi berhasil dihapus');
        } else {
            $this->session->set_flashdata('error', 'Gagal menghapus reservasi');
        }
        redirect('reservation');
    }

    /**
     * Process check-in
     */
    public function check_in($id) {
        if ($this->ReservationModel->checkIn($id)) {
            $this->session->set_flashdata('success', 'Check-in berhasil diproses');
        } else {
            $this->session->set_flashdata('error', 'Gagal memproses check-in');
        }
        redirect('reservation');
    }

    /**
     * Process check-out
     */
    public function check_out($id) {
        if ($this->ReservationModel->checkOut($id)) {
            $this->session->set_flashdata('success', 'Check-out berhasil diproses');
        } else {
            $this->session->set_flashdata('error', 'Gagal memproses check-out');
        }
        redirect('reservation');
    }

    /**
     * Check room availability via AJAX
     */
    public function check_availability() {
        $room_id = $this->input->get('room_id');
        $check_in = $this->input->get('check_in');
        $check_out = $this->input->get('check_out');
        
        $available = $this->ReservationModel->isRoomAvailable($room_id, $check_in, $check_out);
        
        $this->output->set_content_type('application/json')
                     ->set_output(json_encode(['available' => $available]));
    }

    /**
     * Set form validation rules
     */
    private function _setValidationRules() {
        $this->form_validation->set_rules('guest_name', 'Nama Tamu', 'required|min_length[3]');
        $this->form_validation->set_rules('guest_email', 'Email', 'required|valid_email');
        $this->form_validation->set_rules('guest_phone', 'Nomor Telepon', 'required|min_length[10]');
        $this->form_validation->set_rules('room_id', 'Kamar', 'required|numeric');
        $this->form_validation->set_rules('check_in_date', 'Tanggal Check-in', 'required');
        $this->form_validation->set_rules('check_out_date', 'Tanggal Check-out', 'required');
        $this->form_validation->set_rules('num_guests', 'Jumlah Tamu', 'required|numeric|greater_than[0]');
    }
}
