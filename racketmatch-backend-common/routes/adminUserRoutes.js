
const express = require('express');
const router = express.Router();
const User = require('../models/User'); 

router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password'); 
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar utilizadores' });
  }
});

module.exports = router;
