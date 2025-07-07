const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const authAdmin = require('../middleware/authAdmin');


router.get('/', authAdmin, async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name email');
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao procurar posts' });
  }
});


router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post não encontrado' });

    res.json({ message: 'Post removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover post' });
  }
});


router.post('/ban/:userId', authAdmin, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.userId, { isBanned: true });
    res.json({ message: 'Utilizador banido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao banir utilizador' });
  }
});
