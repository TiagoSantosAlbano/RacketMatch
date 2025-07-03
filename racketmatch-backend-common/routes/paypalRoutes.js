const express = require('express');
const controller = require('../controllers/paypalController');
const router = express.Router();

router.post('/create-payment', controller.createPayment);
router.get('/capture-payment', controller.capturePayment);

module.exports = router;
