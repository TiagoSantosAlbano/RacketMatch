const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

/**
 * Middleware para autenticação via JWT.
 * Espera header: Authorization: Bearer <token>
 */
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Exige "Bearer <token>"

  if (!token) {
    console.warn('🚫 Token não fornecido na requisição.');
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    // Valida e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id é obrigatório! Verifica como está o sign no teu login.
    if (!decoded.id) {
      console.warn('❌ Token decodificado mas sem id de usuário.');
      return res.status(401).json({ message: 'Token inválido (sem id de usuário).' });
    }

    // Procura o usuário
    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn('❌ Token válido, mas usuário não encontrado.');
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza última atividade do usuário (opcional, mas útil)
    user.lastSeen = new Date();
    await user.save();

    // Injeta user no req para usar nos controladores
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Erro ao verificar o token:', error.message);
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authenticateToken;
