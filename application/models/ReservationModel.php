<?php
defined('BASEPATH') OR exit('No direct script access allowed');

/**
 * ReservationModel Class
 * 
 * Handles all database operations for reservations including:
 * - Creating new reservations
 * - Checking room availability
 * - Managing check-in/check-out
 * - Retrieving reservation details
 */
class ReservationModel extends CI_Model {
    protected $table = 'reservations';

    public function __construct() {
        parent::__construct();
        $this->load->model('RoomModel');
    }

    /**
     * Get all reservations with room details
     * 
     * @return array Array of reservation objects with room information
     */
    public function getAll() {
        $this->db->select('reservations.*, rooms.number as room_number, rooms.type as room_type');
        $this->db->from($this->table);
        $this->db->join('rooms', 'rooms.id = reservations.room_id');
        $this->db->order_by('check_in_date', 'ASC');
        return $this->db->get()->result();
    }

    /**
     * Get reservation by ID with room details
     * 
     * @param int $id Reservation ID
     * @return object Reservation object with room information
     */
    public function getById($id) {
        $this->db->select('reservations.*, rooms.number as room_number, rooms.type as room_type');
        $this->db->from($this->table);
        $this->db->join('rooms', 'rooms.id = reservations.room_id');
        $this->db->where('reservations.id', $id);
        return $this->db->get()->row();
    }

    /**
     * Create new reservation
     * 
     * @param array $data Reservation data
     * @return bool True on success, false on failure
     */
    public function create($data) {
        // Calculate total price based on room price and number of nights
        $room = $this->RoomModel->getById($data['room_id']);
        $check_in = new DateTime($data['check_in_date']);
        $check_out = new DateTime($data['check_out_date']);
        $nights = $check_in->diff($check_out)->days;
        $data['total_price'] = $room->price * $nights;

        return $this->db->insert($this->table, $data);
    }

    /**
     * Update reservation
     * 
     * @param int $id Reservation ID
     * @param array $data Updated reservation data
     * @return bool True on success, false on failure
     */
    public function update($id, $data) {
        // Recalculate total price if dates changed
        if (isset($data['check_in_date']) && isset($data['check_out_date'])) {
            $room = $this->RoomModel->getById($data['room_id']);
            $check_in = new DateTime($data['check_in_date']);
            $check_out = new DateTime($data['check_out_date']);
            $nights = $check_in->diff($check_out)->days;
            $data['total_price'] = $room->price * $nights;
        }

        $this->db->where('id', $id);
        return $this->db->update($this->table, $data);
    }

    /**
     * Delete reservation
     * 
     * @param int $id Reservation ID
     * @return bool True on success, false on failure
     */
    public function delete($id) {
        $this->db->where('id', $id);
        return $this->db->delete($this->table);
    }

    /**
     * Check if room is available for given dates
     * 
     * @param int $room_id Room ID
     * @param string $check_in Check-in date (Y-m-d)
     * @param string $check_out Check-out date (Y-m-d)
     * @param int $exclude_reservation_id Optional reservation ID to exclude from check
     * @return bool True if room is available, false if not
     */
    public function isRoomAvailable($room_id, $check_in, $check_out, $exclude_reservation_id = null) {
        $this->db->where('room_id', $room_id);
        $this->db->where('status !=', 'cancelled');
        if ($exclude_reservation_id) {
            $this->db->where('id !=', $exclude_reservation_id);
        }
        
        // Check if there are any overlapping reservations
        $this->db->group_start();
        $this->db->where("('$check_in' BETWEEN check_in_date AND DATE_SUB(check_out_date, INTERVAL 1 DAY))");
        $this->db->or_where("('$check_out' BETWEEN DATE_ADD(check_in_date, INTERVAL 1 DAY) AND check_out_date)");
        $this->db->or_where("(check_in_date BETWEEN '$check_in' AND '$check_out')");
        $this->db->group_end();

        $query = $this->db->get($this->table);
        return $query->num_rows() === 0;
    }

    /**
     * Get reservations for calendar view
     * 
     * @param string $start_date Start date (Y-m-d)
     * @param string $end_date End date (Y-m-d)
     * @return array Array of reservations within date range
     */
    public function getCalendarReservations($start_date, $end_date) {
        $this->db->select('reservations.*, rooms.number as room_number, rooms.type as room_type');
        $this->db->from($this->table);
        $this->db->join('rooms', 'rooms.id = reservations.room_id');
        $this->db->where('check_in_date <=', $end_date);
        $this->db->where('check_out_date >=', $start_date);
        $this->db->where('status !=', 'cancelled');
        return $this->db->get()->result();
    }

    /**
     * Process check-in
     * 
     * @param int $id Reservation ID
     * @return bool True on success, false on failure
     */
    public function checkIn($id) {
        $reservation = $this->getById($id);
        if (!$reservation || $reservation->status !== 'pending') {
            return false;
        }

        // Update reservation status and room status
        $this->db->trans_start();
        $this->update($id, ['status' => 'checked_in']);
        $this->RoomModel->update($reservation->room_id, ['status' => 'occupied']);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }

    /**
     * Process check-out
     * 
     * @param int $id Reservation ID
     * @return bool True on success, false on failure
     */
    public function checkOut($id) {
        $reservation = $this->getById($id);
        if (!$reservation || $reservation->status !== 'checked_in') {
            return false;
        }

        // Update reservation status and room status
        $this->db->trans_start();
        $this->update($id, ['status' => 'checked_out']);
        $this->RoomModel->update($reservation->room_id, ['status' => 'dirty']);
        $this->db->trans_complete();

        return $this->db->trans_status();
    }
}
