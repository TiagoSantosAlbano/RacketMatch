const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  try {
    const post = new Post({
      content: req.body.content,
      author: req.user.id,
    });

    await post.save();
    await post.populate('author', 'name');

    res.status(201).json(post);
  } catch (error) {
    console.error('Erro ao criar post:', error);
    res.status(500).json({ error: 'Erro ao criar o post' });
  }
});


router.get('/', async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    console.error('Erro ao procurar posts:', error);
    res.status(500).json({ error: 'Erro ao procurar posts' });
  }
});

module.exports = router;
