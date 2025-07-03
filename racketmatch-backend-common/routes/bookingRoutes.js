const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware');
const bookingController = require('../controllers/bookingController');

router.post('/', auth, bookingController.createBooking);
router.get('/', auth, bookingController.getUserBookings);
router.get('/all', auth, bookingController.getAllBookings); // Admin/debug
router.delete('/:id', auth, bookingController.cancelBooking);

module.exports = router;
