const express = require('express');
const router = express.Router();
const { 
  createHotel, 
  getAllHotels, 
  getHotelById, 
  updateHotel, 
  deleteHotel 
} = require('../controllers/hotel.controller');
const { 
  verifyToken, 
  isAdmin, 
  isOwner, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

router.post('/', verifyToken, isAdmin, uploadImage.single('foto_cover'), createHotel);

router.get('/', verifyToken, getAllHotels);

router.get('/:id', verifyToken, hasHotelAccess, getHotelById);

router.put('/:id', verifyToken, hasHotelAccess, uploadImage.single('foto_cover'), updateHotel);

router.delete('/:id', verifyToken, isAdmin, deleteHotel);

module.exports = router;
