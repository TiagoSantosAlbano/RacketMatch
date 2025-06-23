const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const authMiddleware = require('./authMiddleware');

const app = express();
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// ✅ Importar rotas
const adminRoutes = require('./routes/adminAuth');
const courtRoutes = require('./routes/courtRoutes');
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// ✅ Aplicar rotas
app.use('/api/admin-auth', adminRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// 🧪 Rota mock de notificações (removível se o ficheiro existir)
app.get('/api/notifications', authMiddleware, (req, res) => {
  try {
    const notifications = [
      { id: '1', message: 'New match scheduled!', time: '10:30 AM' },
      { id: '2', message: 'Court booking confirmed', time: 'Yesterday' },
      { id: '3', message: 'John Doe sent you a message', time: '2 days ago' },
    ];
    res.json(notifications);
  } catch (err) {
    console.error('❌ Erro nas notificações:', err);
    res.status(500).json({ message: 'Erro no servidor' });
  }
});

// 🚀 Iniciar o servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend ativo em http://localhost:${PORT}`);
});
