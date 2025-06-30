const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');
const authMiddleware = require('./authMiddleware');

const app = express();

// 🔌 Conexão à base de dados
connectDB();

// 🌐 Middlewares globais
app.use(cors({
  origin: '*', // 🛠️ Em produção, substitui por ['http://teu-dominio.com', 'http://ip-do-mobile']
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 🖼️ Servir imagens da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 📦 Importar rotas
const adminRoutes = require('./routes/adminAuth');
const courtRoutes = require('./routes/courtRoutes');
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// 🔗 Usar rotas da API
app.use('/api/admin-auth', adminRoutes);
app.use('/api/admin/courts', courtRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes); // 👈 registo/login aqui
app.use('/api/premium', premiumRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// ❌ Fallback para rotas inexistentes
app.use((req, res) => {
  console.warn(`❌ Rota não encontrada: ${req.originalUrl}`);
  res.status(404).json({ message: 'Rota não encontrada' });
});

// 🚀 Iniciar servidor — acessível localmente e por IP de rede
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend ativo em:`);
  console.log(`   • http://localhost:${PORT}`);
  console.log(`   • http://<teu-ip-local>:${PORT} 📱 (usa no mobile)`);
});
