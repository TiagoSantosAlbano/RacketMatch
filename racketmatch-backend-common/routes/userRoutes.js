const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Middleware para autenticar JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Token em falta.' });
  const token = authHeader.replace('Bearer ', '');
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido.' });
  }
};

console.log('✅ userRoutes carregado e pronto a receber requisições.');

// Testar backend
router.get('/ping', (req, res) => {
  res.send('✅ Rota GET /ping ativa');
});

// Criar novo utilizador
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
      name, email, password: hashedPassword, skill_level,
      preferredLocations, preferredTimes, location, tenantId,
    });

    await newUser.save();

    return res.status(201).json({
      message: 'Utilizador criado com sucesso!',
      user: {
        id: newUser._id,
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

// LOGIN com logs detalhados
router.post('/login', async (req, res) => {
  console.log('\n--- Novo pedido de LOGIN ---');
  try {
    const { email, password } = req.body;
    console.log('Login recebido para:', email);

    if (!email || !password) {
      console.log('❌ Faltam campos');
      return res.status(400).json({ message: 'Preenche o email e a password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('❌ User não encontrado');
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    } else {
      console.log('✅ User encontrado:', user.email);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('❌ Password incorreta');
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Login válido
    console.log('🔓 Login efetuado com sucesso:', user.email);

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user._id,
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

// GET dados do utilizador autenticado
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json({
      id: user._id,
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
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro no servidor.' });
  }
});

// PUT editar perfil (apenas o próprio)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    if (req.userId !== req.params.id) {
      return res.status(403).json({ message: 'Acesso negado.' });
    }
    const { name, skill_level } = req.body;
    const updateFields = {};
    if (name) updateFields.name = name;
    if (skill_level) updateFields.skill_level = skill_level;
    // outros campos...

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: 'Utilizador não encontrado.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar perfil.' });
  }
});

module.exports = router;

// Mostra todas as rotas carregadas
console.log('Rotas carregadas:', router.stack.map(layer => layer.route ? layer.route.path : layer.name));
