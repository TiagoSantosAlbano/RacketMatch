// routes/bookingRoutes.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const bookingController = require('../controllers/bookingController');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);

module.exports = router;

