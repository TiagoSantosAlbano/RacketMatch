const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const { verifyToken } = require('../middleware/authMiddleware'); // ⬅ usa o middleware JWT

// 🔑 LOGIN
router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Admin não encontrado' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Palavra-passe incorreta' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name || 'Administrador',
        email: admin.email,
        role: 'admin',
      },
    });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro no servidor ao fazer login' });
  }
});

// ✍️ REGISTER (apenas se ainda não existir admin)
router.post('/auth/register', async (req, res) => {
  try {
    const existingAdmins = await Admin.countDocuments();

    if (existingAdmins >= 1) {
      return res.status(403).json({ message: 'Já existe um admin registado' });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ name, email, password: hashedPassword });
    await newAdmin.save();

    res.status(201).json({ message: 'Admin criado com sucesso' });
  } catch (err) {
    console.error('Erro no registo:', err);
    res.status(500).json({ message: 'Erro ao criar admin' });
  }
});

// ✅ Verificação se já existe um admin (usado no login)
router.get('/exists', async (req, res) => {
  try {
    const count = await Admin.countDocuments();
    res.json({ exists: count > 0 });
  } catch (err) {
    console.error('Erro ao verificar admin:', err);
    res.status(500).json({ message: 'Erro ao verificar admin' });
  }
});

// ✅ Rota protegida (exemplo para testar token JWT)
router.get('/protected', verifyToken, (req, res) => {
  res.json({ message: 'Acesso autorizado', user: req.user });
});

module.exports = router;
