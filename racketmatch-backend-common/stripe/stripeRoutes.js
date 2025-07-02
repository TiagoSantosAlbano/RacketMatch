// stripe/stripeRoutes.js
const express = require('express');
const router = express.Router();
const stripeController = require('./stripeController');

// POST /api/stripe/payment-intent
router.post('/payment-intent', stripeController.createCheckoutSession);

module.exports = router;
