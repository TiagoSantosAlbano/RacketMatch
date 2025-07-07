const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const authMiddleware = require('../middleware/auth');


router.post('/', authMiddleware, async (req, res) => {
  const { clubId, content, rating } = req.body;

  if (!clubId || !content) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }

  try {
    const review = await Review.create({
      clubId,
      user: req.user.id,
      content,
      rating: rating || 5,
    });

    const populated = await review.populate('user', 'name');
    res.status(201).json(populated);
  } catch (err) {
    console.error('Erro ao criar review:', err);
    res.status(500).json({ error: 'Erro ao criar review.' });
  }
});