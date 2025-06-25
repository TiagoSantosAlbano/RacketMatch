const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');


// Rotas para quadras
router.get('/', courtController.getAllCourts);
router.post('/', courtController.createCourt);

module.exports = router;