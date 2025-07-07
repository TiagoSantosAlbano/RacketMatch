const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Erro ao procurar notificações:', error);
    res.status(500).json({ error: 'Erro ao procurar notificações.' });
  }
});

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
