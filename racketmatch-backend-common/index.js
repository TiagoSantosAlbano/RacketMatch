const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./db');
const authMiddleware = require('./authMiddleware');

const app = express();
connectDB();

// 🌐 Middlewares globais
app.use(cors());
app.use(express.json());

// 🔁 Importar rotas
const adminRoutes = require('./routes/adminAuth');
const courtRoutes = require('./routes/courtRoutes');
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminCourtsRoutes = require('./routes/adminCourts');

// 🔗 Usar rotas
app.use('/api/admin-auth', adminRoutes);
app.use('/api/courts', courtRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/admin/courts', adminCourtsRoutes); // ✅ Ajustado para ser mais explícito

// 🔚 Rota 404 handler (opcional, boa prática)
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend ativo em http://localhost:${PORT}`);
});
