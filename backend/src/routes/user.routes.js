const express = require('express');
const router = express.Router();
const { 
  getAllUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  changePassword 
} = require('../controllers/user.controller');
const { 
  verifyToken, 
  isAdmin 
} = require('../middleware/auth.middleware');

router.get('/', verifyToken, isAdmin, getAllUsers);

router.get('/:id', verifyToken, getUserById);

router.put('/:id', verifyToken, updateUser);

router.delete('/:id', verifyToken, isAdmin, deleteUser);

router.put('/:id/change-password', verifyToken, changePassword);

module.exports = router;
