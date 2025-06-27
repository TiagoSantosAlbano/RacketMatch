const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');
const authMiddleware = require('./authMiddleware');

const app = express();

// 🛠 Conecta ao MongoDB
connectDB();

// 🌐 Middlewares globais
app.use(cors());
app.use(express.json());

// 🖼️ Servir imagens da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads'))); // 📌 certifique-se de que 'public/uploads' existe

// 📦 Importar rotas
const adminRoutes = require('./routes/adminAuth');
const courtRoutes = require('./routes/courtRoutes');           // <- routes/courtRoutes.js
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// 📌 Verifica se este existe antes de incluir
// const adminCourtsRoutes = require('./routes/adminCourts'); // ❌ REMOVE isto se não tens esse ficheiro

// 🔗 Usar rotas
app.use('/api/admin-auth', adminRoutes);
app.use('/api/admin/courts', courtRoutes); // agora a rota existe como pedida                       // <- A rota correta com upload incluído
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);

// ❌ 404 Handler
app.use((req, res) => {
  res.status(404).json({ message: 'Rota não encontrada' });
});

// 🚀 Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Backend ativo em http://localhost:${PORT}`);
});

