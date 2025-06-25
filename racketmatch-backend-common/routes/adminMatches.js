const express = require('express');
const router = express.Router();
const Match = require('../models/Match');
const User = require('../models/User');
const authAdmin = require('../middleware/authAdmin');

// 🔍 Ver todas as partidas
router.get('/', authAdmin, async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('createdBy', 'name email')
      .populate('players', 'name email');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar partidas' });
  }
});

// 👥 Ver jogadores de uma partida específica
router.get('/:id/players', authAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id).populate('players', 'name email');
    if (!match) return res.status(404).json({ error: 'Partida não encontrada' });

    res.json(match.players);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar jogadores' });
  }
});

// ❌ Remover partida
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ error: 'Partida não encontrada' });

    res.json({ message: 'Partida removida com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover partida' });
  }
});

// ➕ Adicionar admin manualmente como jogador (testes, moderação)
router.post('/:id/join', authAdmin, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Partida não encontrada' });

    if (match.players.length >= 4)
      return res.status(400).json({ error: 'Partida já completa' });

    if (!match.players.includes(req.admin.id)) {
      match.players.push(req.admin.id);
      await match.save();
    }

    res.json({ message: 'Admin entrou na partida', match });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao entrar na partida' });
  }
});
