const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const dashboardController = require('../controllers/dashboard.controller');

router.get('/stats', verifyToken, dashboardController.getStats);

module.exports = router;
