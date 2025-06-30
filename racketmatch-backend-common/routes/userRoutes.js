const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

// 🚀 Debug: confirmação que o ficheiro foi carregado corretamente
console.log('✅ userRoutes carregado e pronto a receber requisições.');

// ✅ GET /api/users/ping — testar se o backend está a responder
router.get('/ping', (req, res) => {
  res.send('✅ Rota GET /ping ativa');
});

// ✅ POST /api/users/register — criar um novo utilizador
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      skill_level,
      preferredLocations,
      preferredTimes,
      location,
      tenantId,
    } = req.body;

    // Validação de campos obrigatórios
    if (
      !name || !email || !password || !skill_level ||
      !preferredLocations || !preferredTimes ||
      !location || !Array.isArray(location.coordinates) ||
      location.coordinates.length !== 2 || !tenantId
    ) {
      return res.status(400).json({ message: 'Preenche todos os campos obrigatórios.' });
    }

    // Verificar se já existe utilizador com o mesmo email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email já registado.' });
    }

    // Encriptar password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar novo utilizador
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      skill_level,
      preferredLocations,
      preferredTimes,
      location,
      tenantId,
    });

    await newUser.save();

    console.log(`✅ Novo utilizador registado: ${email}`);

    // ✅ Devolver dados do utilizador registado
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
      },
    });
  } catch (error) {
    console.error('❌ Erro ao criar utilizador:', error);
    return res.status(500).json({ message: 'Erro no servidor. Tenta novamente mais tarde.' });
  }
});

// ✅ POST /api/users/login — login do utilizador
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Preenche o email e a password.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    console.log(`🔓 Login efetuado: ${email}`);

    return res.status(200).json({
      message: 'Login efetuado com sucesso.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        skill_level: user.skill_level,
        preferredLocations: user.preferredLocations,
        preferredTimes: user.preferredTimes,
        tenantId: user.tenantId,
      },
    });
  } catch (error) {
    console.error('❌ Erro no login:', error);
    return res.status(500).json({ message: 'Erro no servidor.' });
  }
});

module.exports = router;
