const express = require('express');
const router = express.Router();
const { 
  createBankAccount, 
  getBankAccountsByHotelId, 
  getBankAccountById, 
  updateBankAccount, 
  deleteBankAccount 
} = require('../controllers/bankAccount.controller');
const { 
  verifyToken, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');

router.post('/', verifyToken, hasHotelAccess, createBankAccount);

router.get('/hotel/:hotelId', verifyToken, hasHotelAccess, getBankAccountsByHotelId);

router.get('/:id', verifyToken, getBankAccountById);

router.put('/:id', verifyToken, hasHotelAccess, updateBankAccount);

router.delete('/:id', verifyToken, hasHotelAccess, deleteBankAccount);

module.exports = router;
