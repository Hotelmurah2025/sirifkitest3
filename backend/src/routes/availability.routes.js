const express = require('express');
const router = express.Router();
const { 
  createOrUpdateAvailability, 
  getAvailabilityByRoomAndDateRange, 
  bulkUploadAvailability 
} = require('../controllers/availability.controller');
const { 
  verifyToken, 
  hasHotelAccess 
} = require('../middleware/auth.middleware');
const { uploadCSV } = require('../middleware/upload.middleware');

router.post('/', verifyToken, hasHotelAccess, createOrUpdateAvailability);

router.get('/room/:room_id', verifyToken, getAvailabilityByRoomAndDateRange);

router.post('/bulk-upload', verifyToken, hasHotelAccess, uploadCSV.single('csv_file'), bulkUploadAvailability);

module.exports = router;
