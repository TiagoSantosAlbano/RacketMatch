const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../authMiddleware'); // middleware de autenticação

// Ativação do modo Premium
router.post('/activate', authMiddleware, async (req, res) => {
  try {
    const user = req.user; // O middleware de auth injeta o usuário aqui

    // Verifica se o utilizador já é premium
    if (user.isPremium) {
      return res.status(200).json({ message: '🟡 O utilizador já é Premium.' });
    }

    // Aqui deverias atualizar o utilizador na base de dados:
    // await User.findByIdAndUpdate(user._id, { isPremium: true });

    // Como exemplo (mock), apenas devolvemos sucesso:
    res.status(200).json({ message: '✅ Conta atualizada para Premium com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao ativar Premium:', error.message);
    res.status(500).json({ message: 'Erro ao ativar Premium', error: error.message });
  }
});

module.exports = router;
