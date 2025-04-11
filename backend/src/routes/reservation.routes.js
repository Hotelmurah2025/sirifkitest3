const express = require('express');
const router = express.Router();
const { 
  createReservation, 
  getReservationsByHotelId, 
  getReservationById, 
  updateReservationStatus 
} = require('../controllers/reservation.controller');
const { 
  verifyToken, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');

router.post('/', verifyToken, hasHotelAccess, createReservation);

router.get('/hotel/:hotelId', verifyToken, hasHotelAccess, getReservationsByHotelId);

router.get('/:id', verifyToken, getReservationById);

router.put('/:id/status', verifyToken, hasHotelAccess, updateReservationStatus);

module.exports = router;
