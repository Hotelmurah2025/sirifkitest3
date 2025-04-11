const express = require('express');
const router = express.Router();
const { 
  createRatePlan, 
  getRatePlansByRoomId, 
  getRatePlanById, 
  updateRatePlan, 
  deleteRatePlan,
  getApplicableRatePlans
} = require('../controllers/rateplan.controller');
const { verifyToken, hasHotelAccess } = require('../middleware/auth.middleware');

router.post('/', verifyToken, hasHotelAccess, createRatePlan);

router.get('/room/:roomId', verifyToken, getRatePlansByRoomId);

router.get('/applicable', verifyToken, getApplicableRatePlans);

router.get('/:id', verifyToken, getRatePlanById);

router.put('/:id', verifyToken, hasHotelAccess, updateRatePlan);

router.delete('/:id', verifyToken, hasHotelAccess, deleteRatePlan);

module.exports = router;
