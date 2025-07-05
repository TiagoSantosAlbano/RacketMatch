// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'Token não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' });

    req.user = user;
    req.userId = user.id; // Adicionar userId para compatibilidade
    next();
  });
}

// Exportar tanto como função direta quanto como objeto
module.exports = verifyToken;
module.exports.verifyToken = verifyToken;
