const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const authMiddleware = require('../middleware/auth');

// Criar uma nova partida
router.post('/', authMiddleware, async (req, res) => {
  try {
    const matchData = {
      ...req.body,
      createdBy: req.user.id,
      players: [req.user.id], // criador já entra
    };

    const newMatch = await Match.create(matchData);
    res.status(201).json(newMatch);
  } catch (error) {
    console.error('Erro ao criar partida:', error);
    res.status(500).json({ message: 'Erro ao criar partida' });
  }
});

// Obter todas as partidas com vagas (menos de 4 jogadores)
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('createdBy', 'name email')
      .populate('players', 'name')
      .where('players').lt(4);

    res.json(matches);
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    res.status(500).json({ message: 'Erro ao buscar partidas' });
  }
});

module.exports = router;
