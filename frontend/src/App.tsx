import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/dashboard/Dashboard'
import HotelList from './pages/hotel/HotelList'
import AddEditHotel from './pages/hotel/AddEditHotel'
import RoomList from './pages/room/RoomList'
import AddEditRoom from './pages/room/AddEditRoom'
import AvailabilityCalendar from './pages/availability/AvailabilityCalendar'
import BulkUpload from './pages/availability/BulkUpload'
import ReservationList from './pages/reservation/ReservationList'
import PromotionList from './pages/promotion/PromotionList'
import TransactionList from './pages/transaction/TransactionList'
import BankAccountList from './pages/bank-account/BankAccountList'
import UserSettings from './pages/settings/UserSettings'
import { Toaster } from 'sonner'
import './App.css'

import MainLayout from './components/layout/MainLayout'

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Hotel Management */}
          <Route path="hotels" element={<HotelList />} />
          <Route path="hotels/add" element={<AddEditHotel />} />
          <Route path="hotels/edit/:id" element={<AddEditHotel />} />
          
          {/* Room Management */}
          <Route path="rooms" element={<RoomList />} />
          <Route path="rooms/add" element={<AddEditRoom />} />
          <Route path="rooms/edit/:id" element={<AddEditRoom />} />
          
          {/* Availability Management */}
          <Route path="availability" element={<AvailabilityCalendar />} />
          <Route path="availability/bulk-upload" element={<BulkUpload />} />
          
          {/* Reservation Management */}
          <Route path="reservations" element={<ReservationList />} />
          <Route path="reservations/:id" element={<div>Reservation Detail</div>} />
          
          {/* Financial Management */}
          <Route path="transactions" element={<TransactionList />} />
          <Route path="transactions/invoice" element={<div>Invoice Report</div>} />
          <Route path="bank-accounts" element={<BankAccountList />} />
          
          {/* Promotion Management */}
          <Route path="promotions" element={<PromotionList />} />
          <Route path="promotions/add" element={<div>Add Promotion</div>} />
          <Route path="promotions/edit/:id" element={<div>Edit Promotion</div>} />
          
          {/* User Management */}
          <Route path="users" element={<div>User List</div>} />
          <Route path="users/add" element={<div>Add User</div>} />
          <Route path="users/edit/:id" element={<div>Edit User</div>} />
          
          {/* Settings */}
          <Route path="settings" element={<UserSettings />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<div>Not Found</div>} />
      </Routes>
      
      <Toaster position="top-right" />
    </Router>
  )
}

export default App
