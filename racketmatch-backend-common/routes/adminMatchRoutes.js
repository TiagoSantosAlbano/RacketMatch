const express = require('express');
const router = express.Router();
const Match = require('../models/Match');


router.get('/', async (req, res) => {
  try {
    const matches = await Match.find().populate('players createdBy tenantId');
    res.json(matches);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar partidas' });
  }
});



module.exports = router;
