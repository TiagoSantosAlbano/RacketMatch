const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/activate', authMiddleware, async (req, res) => {
  try {
    const user = req.user; 

    
    if (user.isPremium) {
      return res.status(200).json({ message: '🟡 O utilizador já é Premium.' });
    }

    res.status(200).json({ message: '✅ Conta atualizada para Premium com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao ativar Premium:', error.message);
    res.status(500).json({ message: 'Erro ao ativar Premium', error: error.message });
  }
});

module.exports = router;
