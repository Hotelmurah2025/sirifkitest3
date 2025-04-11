const express = require('express');
const router = express.Router();
const { 
  createTransaction, 
  getTransactionsByHotelId, 
  getTransactionById, 
  updateTransactionStatus, 
  generateMonthlyInvoice 
} = require('../controllers/transaction.controller');
const { 
  verifyToken, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');
const { uploadImage } = require('../middleware/upload.middleware');

router.post('/', verifyToken, hasHotelAccess, uploadImage.single('bukti_pembayaran'), createTransaction);

router.get('/hotel/:hotelId', verifyToken, hasHotelAccess, getTransactionsByHotelId);

router.get('/:id', verifyToken, getTransactionById);

router.put('/:id/status', verifyToken, hasHotelAccess, uploadImage.single('bukti_pembayaran'), updateTransactionStatus);

router.get('/invoice/hotel/:hotelId', verifyToken, hasHotelAccess, generateMonthlyInvoice);

module.exports = router;
