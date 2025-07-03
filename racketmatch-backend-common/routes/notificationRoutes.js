const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');

// Buscar todas as notificações do utilizador logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ error: 'Erro ao buscar notificações.' });
  }
});

// Marcar todas como lidas
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user.id, read: false }, { $set: { read: true } });
    res.json({ message: 'Notificações marcadas como lidas.' });
  } catch (error) {
    console.error('Erro ao atualizar notificações:', error);
    res.status(500).json({ error: 'Erro ao atualizar notificações.' });
  }
});

module.exports = router;
