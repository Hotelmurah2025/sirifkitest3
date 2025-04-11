const express = require('express');
const router = express.Router();
const { 
  createRoom, 
  getRoomsByHotelId, 
  getRoomById, 
  updateRoom, 
  deleteRoom 
} = require('../controllers/room.controller');
const { 
  verifyToken, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

router.post('/', verifyToken, hasHotelAccess, uploadImage.array('foto_kamar', 5), createRoom);

router.get('/hotel/:hotelId', verifyToken, hasHotelAccess, getRoomsByHotelId);

router.get('/:id', verifyToken, getRoomById);

router.put('/:id', verifyToken, hasHotelAccess, uploadImage.array('foto_kamar', 5), updateRoom);

router.delete('/:id', verifyToken, hasHotelAccess, deleteRoom);

module.exports = router;
