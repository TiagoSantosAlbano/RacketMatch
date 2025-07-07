const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '⚠️ Token não fornecido ou mal formatado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: '❌ Acesso negado. Apenas administradores podem aceder.' });
    }


    req.admin = decoded;

    next();
  } catch (error) {
    console.error('❌ Erro ao verificar token do admin:', error.message);
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
