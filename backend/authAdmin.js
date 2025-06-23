// backend/authAdmin.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '⚠️ Token não fornecido' });
  }

  try {
    // Verifica assinatura e conteúdo do token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Garante que é um admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: '❌ Acesso negado. Apenas administradores podem aceder.' });
    }

    // Garante que já passou na verificação de 2FA
    if (!decoded.twoFactorVerified) {
      return res.status(401).json({ message: '🔒 Verificação 2FA pendente. Por favor, insira o código recebido por email.' });
    }

    // Tudo certo, passa o admin para o próximo middleware ou rota
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Erro no authAdmin:', error.message);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
