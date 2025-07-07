const express = require('express');
const router = express.Router();
const paypalController = require('../controllers/paypalController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/create', authMiddleware, paypalController.createPayment);
router.get('/capture', paypalController.capturePayment);

module.exports = router;
