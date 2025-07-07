const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const Notification = require('../models/Notification');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');


router.post('/:id/join', authMiddleware, async (req, res) => {
  const matchId = req.params.id;
  const userId = req.user.id;

  try {
    const match = await Match.findById(matchId).populate('createdBy');
    if (!match) return res.status(404).json({ error: 'Partida não encontrada' });

    if (match.players.includes(userId))
      return res.status(400).json({ error: 'Você já está na partida' });

    if (match.players.length >= 4)
      return res.status(400).json({ error: 'Partida completa' });

    match.players.push(userId);
    await match.save();

    const joiningUser = await User.findById(userId);


    await Notification.create({
      userId: match.createdBy._id,
      message: `${joiningUser.name} juntou-se à sua partida.`,
    });

    res.json({ message: 'Entrou na partida com sucesso', match });
  } catch (error) {
    console.error('Erro ao entrar na partida:', error);
    res.status(500).json({ error: 'Erro do servidor' });
  }
});

module.exports = router;
