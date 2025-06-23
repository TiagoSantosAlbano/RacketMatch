const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Rotas para usuários
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);

module.exports = router;