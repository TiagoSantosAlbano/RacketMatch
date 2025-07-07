const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/matchmaking', authMiddleware, matchController.getPremiumMatchSuggestions);


router.get('/', matchController.getAllMatches);


router.post('/', authMiddleware, matchController.createMatch);


router.post('/:matchId/join', authMiddleware, matchController.joinMatch);

module.exports = router;
