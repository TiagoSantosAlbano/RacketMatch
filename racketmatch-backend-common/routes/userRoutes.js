const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Importação do middleware
const authMiddleware = require('../middleware/authMiddleware');

console.log('✅ authMiddleware carregado:', typeof authMiddleware);

const router = express.Router();

console.log('✅ userRoutes carregado e pronto a receber requisições.');

// Rota de teste
router.get('/ping', (req, res) => {
  res.send('✅ Rota GET /ping ativa');
});

// Criar novo utilizador (register)
router.post('/register', async (req, res) => {
  try {
    const {
      name, email, password, skill_level, preferredLocations,
      preferredTimes, location, tenantId,
    } = req.body;

    if (
      !name || !email || !password || !skill_level ||
      !preferredLocations || !preferredTimes ||
      !location || !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 || !tenantId
    ) {
      return res.status(400).json({ message: 'Preenche todos os campos obrigatórios.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registado.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skill_level,
      preferredLocations: Array.isArray(preferredLocations) ? preferredLocations : [preferredLocations],
      preferredTimes: Array.isArray(preferredTimes) ? preferredTimes : [preferredTimes],
      location,
      tenantId,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'Utilizador criado com sucesso!',
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        skill_level: newUser.skill_level,
        preferredLocations: newUser.preferredLocations,
        preferredTimes: newUser.preferredTimes,
        tenantId: newUser.tenantId,
        isPremium: newUser.isPremium,
        premiumSince: newUser.premiumSince,
        lastSeen: newUser.lastSeen,
      },
    });
  } catch (error) {
    console.error('❌ Erro ao criar utilizador:', error);
    return res.status(500).json({ message: 'Erro no servidor. Tenta novamente mais tarde.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Preenche o email e a password.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Credenciais inválidas.' });

    // TOKEN COM CAMPO id (NÃO userId)!
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        skill_level: user.skill_level,
        preferredLocations: user.preferredLocations,
        preferredTimes: user.preferredTimes,
        tenantId: user.tenantId,
        isPremium: user.isPremium,
        premiumSince: user.premiumSince,
        lastSeen: user.lastSeen,
      },
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// POST dados do utilizador autenticado
router.get('/me', async (req, res) => {
  try {
    // Busca SEM autenticação (demo): usa sempre o primeiro user na BD!
    const user = await User.findOne();
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      skill_level: user.skill_level,
      preferredLocations: user.preferredLocations,
      preferredTimes: user.preferredTimes,
      tenantId: user.tenantId,
      premiumSince: user.premiumSince,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar utilizador:', error);
    res.status(500).json({ message: 'Erro ao buscar utilizador.' });
  }
});

// GET user por ID (apenas o próprio)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      skill_level: user.skill_level,
      preferredLocations: user.preferredLocations,
      preferredTimes: user.preferredTimes,
      tenantId: user.tenantId,
      premiumSince: user.premiumSince,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error('❌ Erro ao buscar utilizador por ID:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// PUT editar perfil (apenas o próprio)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const { name, skill_level, preferredLocations, preferredTimes } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (skill_level) updateFields.skill_level = skill_level;
    if (preferredLocations !== undefined) {
      if (Array.isArray(preferredLocations)) {
        updateFields.preferredLocations = preferredLocations.map(String);
      } else if (typeof preferredLocations === "string") {
        updateFields.preferredLocations = preferredLocations.split(',').map(l => l.trim());
      }
    }
    if (preferredTimes !== undefined) {
      if (Array.isArray(preferredTimes)) {
        updateFields.preferredTimes = preferredTimes.map(String);
      } else if (typeof preferredTimes === "string") {
        updateFields.preferredTimes = preferredTimes.split(',').map(t => t.trim());
      }
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });

    console.log('✅ Utilizador atualizado:', user);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isPremium: user.isPremium,
      skill_level: user.skill_level,
      preferredLocations: user.preferredLocations,
      preferredTimes: user.preferredTimes,
      tenantId: user.tenantId,
      premiumSince: user.premiumSince,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error('❌ Erro ao atualizar perfil:', error);
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
});

// DELETE utilizador (apenas o próprio)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Utilizador eliminado com sucesso.' });
  } catch (error) {
    console.error('❌ Erro ao eliminar utilizador:', error);
    res.status(500).json({ message: 'Erro ao eliminar utilizador.' });
  }
});

// Ativar Premium manualmente (admin manual)
router.post('/:id/activate-premium', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: { isPremium: true, premiumSince: new Date() }
      },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json({ message: 'Premium ativado!', user });
  } catch (err) {
    console.error('❌ Erro ao ativar premium:', err);
    res.status(500).json({ message: 'Erro ao ativar premium.' });
  }
});

// *** NÃO ALTERAR! ***
module.exports = router;