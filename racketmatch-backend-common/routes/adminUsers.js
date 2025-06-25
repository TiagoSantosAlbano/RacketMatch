const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authAdmin = require('../middleware/authAdmin');

// ✅ Listar todos os utilizadores
router.get('/', authAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password'); // esconder senha
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar utilizadores' });
  }
});

// ✅ Obter dados de um utilizador específico
router.get('/:id', authAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar utilizador' });
  }
});

// ✅ Criar um novo utilizador
router.post('/', authAdmin, async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email já em uso' });

    const user = new User({ name, email, password, isAdmin });
    await user.save();
    res.status(201).json({ message: 'Utilizador criado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar utilizador' });
  }
});

// ✅ Editar utilizador
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const { name, email, isPremium, isAdmin } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, isPremium, isAdmin },
      { new: true }
    );
    if (!user) return res.status(404).json({ error: 'Utilizador não encontrado' });
    res.json({ message: 'Utilizador atualizado com sucesso', user });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar utilizador' });
  }
});

// ✅ Remover utilizador
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Utilizador não encontrado' });
    res.json({ message: 'Utilizador removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover utilizador' });
  }
});

module.exports = router;
