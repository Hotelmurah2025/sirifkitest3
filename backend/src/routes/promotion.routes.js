const express = require('express');
const router = express.Router();
const { 
  createPromotion, 
  getPromotionsByHotelId, 
  getPromotionById, 
  updatePromotion, 
  deletePromotion 
} = require('../controllers/promotion.controller');
const { 
  verifyToken, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');

router.post('/', verifyToken, hasHotelAccess, createPromotion);

router.get('/hotel/:hotelId', verifyToken, hasHotelAccess, getPromotionsByHotelId);

router.get('/:id', verifyToken, getPromotionById);

router.put('/:id', verifyToken, hasHotelAccess, updatePromotion);

router.delete('/:id', verifyToken, hasHotelAccess, deletePromotion);

module.exports = router;
