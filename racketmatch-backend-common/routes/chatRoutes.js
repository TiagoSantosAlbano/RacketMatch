const express = require('express');
const router = express.Router();
const Chat = require('../models/Chat');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const chats = await Chat.find({ participants: userId })
      .populate('participants', 'name email')
      .populate('messages.sender', 'name');
    res.json({ chats });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao procurar conversas.' });
  }
});


router.post('/', authMiddleware, async (req, res) => {
  try {
    const userId1 = req.user._id;
    const { targetName } = req.body;
    if (!targetName) return res.status(400).json({ message: 'Nome do destinatário obrigatório.' });


    const user2 = await User.findOne({ name: targetName });
    if (!user2) return res.status(404).json({ message: 'Utilizador destino não encontrado.' });

    let chat = await Chat.findOne({ participants: { $all: [userId1, user2._id], $size: 2 } });
    if (!chat) {
      chat = new Chat({ participants: [userId1, user2._id], messages: [] });
      await chat.save();
    }
    res.json({ chatId: chat._id });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar/obter chat.' });
  }
});


router.get('/:chatId', authMiddleware, async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.chatId)
      .populate('participants', 'name email')
      .populate('messages.sender', 'name');
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado.' });
    if (!chat.participants.some(u => u._id.equals(req.user._id))) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter chat.' });
  }
});


router.post('/:chatId/message', authMiddleware, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Mensagem obrigatória.' });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: 'Chat não encontrado.' });

    if (!chat.participants.some(u => u.equals(req.user._id))) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }

    chat.messages.push({
      sender: req.user._id,
      text,
      timestamp: new Date()
    });
    await chat.save();
    res.json(chat);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao enviar mensagem.' });
  }
});

module.exports = router;
