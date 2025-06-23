const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');
const Court = require('../models/Court');
const authAdmin = require('../middleware/authAdmin');

// Estatísticas gerais
router.get('/', authAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourts = await Court.countDocuments();
    const totalMatches = await Match.countDocuments();

    // Jogadores online = últimos 10 min
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const onlineUsers = await User.countDocuments({
      lastSeen: { $gte: tenMinutesAgo },
    });

    res.json({
      totalUsers,
      totalCourts,
      totalMatches,
      onlineUsers,
    });
  } catch (err) {
    console.error('Erro ao buscar estatísticas:', err);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});
