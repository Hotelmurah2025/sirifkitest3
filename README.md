# Hotel Property Management System

A comprehensive hotel management system built with CodeIgniter 3, featuring room management, reservations, housekeeping, and reporting functionalities.

## Technology Stack
- Backend: CodeIgniter 3 (PHP Framework)
- Frontend: Bootstrap 5
- Database: MySQL
- Additional: jQuery for form validation and dynamic interactions

## Project Structure

### Controllers
1. **ReservationController**
   - `index()` - List all reservations
   - `create()` - Show reservation form
   - `store()` - Save new reservation
   - `show($id)` - View reservation details
   - `edit($id)` - Edit reservation form
   - `update($id)` - Update reservation
   - `delete($id)` - Cancel reservation
   - `checkIn($id)` - Process check-in
   - `checkOut($id)` - Process check-out

2. **RoomController**
   - `index()` - List all rooms
   - `create()` - Show room creation form
   - `store()` - Save new room
   - `show($id)` - View room details
   - `edit($id)` - Edit room form
   - `update($id)` - Update room
   - `delete($id)` - Delete room
   - `updateStatus($id)` - Update room status

3. **HousekeepingController**
   - `index()` - List rooms for cleaning
   - `updateStatus($id)` - Update room cleaning status
   - `schedule()` - View cleaning schedule
   - `assignTask($id)` - Assign cleaning task

4. **GuestController**
   - `index()` - List all guests
   - `show($id)` - View guest details
   - `history($id)` - View guest booking history

5. **ReportController**
   - `daily()` - Daily occupancy and revenue
   - `monthly()` - Monthly statistics
   - `occupancy()` - Occupancy rate report
   - `revenue()` - Revenue analysis

6. **AuthController**
   - `login()` - User login
   - `logout()` - User logout
   - `dashboard()` - User dashboard

### Models
1. **ReservationModel**
   - Handles booking data and guest information
   - Manages check-in/check-out processes
   - Tracks reservation status

2. **RoomModel**
   - Manages room information
   - Tracks room status
   - Handles room type and pricing

3. **HousekeepingModel**
   - Manages cleaning schedules
   - Tracks room cleaning status
   - Handles staff assignments

4. **GuestModel**
   - Stores guest information
   - Manages guest profiles
   - Tracks guest history

5. **ReportModel**
   - Generates occupancy reports
   - Calculates revenue statistics
   - Provides analytical data

6. **UserModel**
   - Manages user authentication
   - Handles user roles and permissions

### Views
1. **Templates**
   - Admin dashboard layout
   - Receptionist interface
   - Housekeeping staff view

2. **Reservation Views**
   - Booking form
   - Reservation list
   - Check-in/out interface
   - Interactive calendar

3. **Room Management Views**
   - Room list
   - Room status board
   - Room type management

4. **Housekeeping Views**
   - Cleaning schedule
   - Task assignment board
   - Status update interface

5. **Report Views**
   - Daily reports
   - Monthly statistics
   - Revenue charts
   - Occupancy graphs

## Database Schema

### Tables
1. **users**
   - id (PK)
   - username
   - password
   - role (admin/receptionist/housekeeping)
   - created_at
   - updated_at

2. **rooms**
   - id (PK)
   - number
   - type
   - price
   - status (available/occupied/dirty)
   - facilities
   - created_at
   - updated_at

3. **guests**
   - id (PK)
   - name
   - email
   - phone
   - address
   - created_at
   - updated_at

4. **reservations**
   - id (PK)
   - guest_id (FK)
   - room_id (FK)
   - check_in_date
   - check_out_date
   - status (pending/checked_in/checked_out/cancelled)
   - total_guests
   - total_price
   - created_at
   - updated_at

5. **housekeeping**
   - id (PK)
   - room_id (FK)
   - user_id (FK)
   - status (pending/in_progress/completed)
   - scheduled_date
   - completed_date
   - notes
   - created_at
   - updated_at

## Features

### 1. Reservation Management
- Room booking form with guest details
- Room type and guest count selection
- Interactive availability calendar
- Check-in/out processing

### 2. Room Management
- CRUD operations for rooms
- Room status tracking
- Room type and pricing management
- Facility management

### 3. Housekeeping
- Cleaning schedule management
- Room status updates
- Task assignment system
- Cleaning history tracking

### 4. Guest Management
- Guest profile management
- Booking history tracking
- Guest preferences storage

### 5. Reporting
- Daily occupancy reports
- Monthly revenue statistics
- Occupancy rate analysis
- Revenue tracking

### 6. Additional Features
- Multi-level user authentication
- Dashboard with hotel statistics
- Check-out notifications
- API integration capability

## Security Implementation Guide

### 1. Form Validation and Input Security
```php
// Controller example using CodeIgniter form validation
public function store() {
    $this->load->library('form_validation');
    
    // Set validation rules
    $this->form_validation->set_rules('guest_name', 'Nama Tamu', 'required|min_length[3]|xss_clean');
    $this->form_validation->set_rules('guest_email', 'Email', 'required|valid_email');
    $this->form_validation->set_rules('guest_phone', 'Nomor Telepon', 'required|numeric|min_length[10]');
    
    if ($this->form_validation->run() === FALSE) {
        // Handle validation errors
        $this->load->view('form_view');
    } else {
        // Process valid data
        $this->ReservationModel->create($this->input->post());
    }
}
```

### 2. Data Protection
#### Sensitive Data Handling
- Guest Information:
  ```php
  // Model example for encrypting sensitive data
  public function store_guest_data($data) {
      $encrypted_data = [
          'name' => $data['name'],
          'email' => $this->encryption->encrypt($data['email']),
          'phone' => $this->encryption->encrypt($data['phone'])
      ];
      return $this->db->insert('guests', $encrypted_data);
  }
  ```
- Financial Reports:
  - Implement role-based access for financial data
  - Log all access to financial reports
  - Encrypt sensitive financial information

### 3. Authentication & Authorization
```php
// Example of multi-level user access control
class Auth {
    private $access_levels = [
        'admin' => 100,
        'receptionist' => 50,
        'housekeeping' => 25
    ];

    public function check_access($required_level) {
        $user_level = $this->session->userdata('user_level');
        return $this->access_levels[$user_level] >= $this->access_levels[$required_level];
    }
}

// Usage in controllers
public function financial_report() {
    if (!$this->auth->check_access('admin')) {
        show_error('Unauthorized access', 403);
    }
    // Process report
}
```

### 4. Database Security
- Use CodeIgniter's Query Builder for safe queries:
```php
// Safe query example
$this->db->where('id', $this->input->post('id', TRUE));
$this->db->get('reservations');

// Instead of raw SQL:
// SELECT * FROM reservations WHERE id = '$id' // Vulnerable to SQL injection
```

### 5. Session Security
```php
// Configure secure session in config.php
$config['sess_cookie_name'] = 'ci_session';
$config['sess_expiration'] = 7200;
$config['sess_save_path'] = NULL;
$config['sess_match_ip'] = TRUE;
$config['sess_time_to_update'] = 300;
```

### 6. CSRF Protection
```php
// In forms
<?php echo form_open('reservation/create'); ?>
// Automatically adds CSRF token

// Verify in controllers
if ($this->security->get_csrf_hash() !== $this->input->post('csrf_token')) {
    show_error('Invalid security token');
}
```

### 7. XSS Prevention
- Enable global XSS filtering in config.php:
```php
$config['global_xss_filtering'] = TRUE;
```
- Use `html_escape()` when outputting data:
```php
<?php echo html_escape($guest_name); ?>
```

### 8. File Upload Security
```php
// Secure file upload configuration
$config['upload_path'] = './uploads/';
$config['allowed_types'] = 'gif|jpg|png|pdf';
$config['max_size'] = 2048;
$config['file_ext_tolower'] = TRUE;
$config['encrypt_name'] = TRUE;
```

### 9. Error Handling
```php
// Custom error handler
public function show_error($message, $status_code = 500) {
    log_message('error', $message);
    $this->output->set_status_header($status_code);
    $this->load->view('errors/custom_error', ['message' => $message]);
}
```

### 10. Security Best Practices
1. **Password Management**
   - Use password_hash() for storing passwords
   - Implement password complexity requirements
   - Regular password rotation policy

2. **Access Control**
   - Implement principle of least privilege
   - Regular access review
   - Session timeout for inactive users

3. **Data Protection**
   - Regular backups
   - Data encryption at rest
   - Secure communication (HTTPS)

4. **Monitoring**
   - Implement activity logging
   - Regular security audits
   - Monitor failed login attempts

5. **Maintenance**
   - Regular security updates
   - Periodic security assessment
   - Incident response plan

Remember to always validate and sanitize all user inputs, implement proper access controls, and regularly update security measures to protect sensitive hotel data.
