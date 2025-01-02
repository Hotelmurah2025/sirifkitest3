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

## Security Considerations
- Password hashing
- CSRF protection
- XSS prevention
- Input validation
- Role-based access control
