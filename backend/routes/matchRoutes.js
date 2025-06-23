const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../authMiddleware');

// Rotas para partidas existentes
router.get('/', matchController.getAllMatches);
router.post('/', matchController.createMatch);

// 🔥 Rota de matchmaking com prioridade para utilizadores Premium
router.get('/matchmaking', authMiddleware, matchController.getPremiumMatchSuggestions);

module.exports = router;
