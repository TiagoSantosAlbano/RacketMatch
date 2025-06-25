const jwt = require('jsonwebtoken');
const User = require('./models/User');
require('dotenv').config();

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Espera "Bearer <token>"

  if (!token) {
    console.warn('🚫 Token não fornecido na requisição.');
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      console.warn('❌ Token válido, mas usuário não encontrado.');
      return res.status(401).json({ message: 'Usuário não encontrado.' });
    }

    // Atualiza a última atividade
    user.lastSeen = new Date();
    await user.save();

    req.user = user; // Injeta o usuário no request
    next();
  } catch (error) {
    console.error('❌ Erro ao verificar o token:', error.message);
    return res.status(403).json({ message: 'Token inválido ou expirado.' });
  }
};

module.exports = authenticateToken;
