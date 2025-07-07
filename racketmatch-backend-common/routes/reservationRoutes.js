const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/mine', authMiddleware, reservationController.getUserReservations);

module.exports = router;
