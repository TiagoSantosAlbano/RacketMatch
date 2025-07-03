const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');
const authMiddleware = require('./middleware/authMiddleware'); // Caminho certo! (está na pasta middleware)

const app = express();

// DEBUG ÚTIL
console.log('Mongo URI:', process.env.MONGODB_URI || process.env.MONGO_URI);
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Porta configurada:', process.env.PORT);

// 1. Conexão à base de dados
connectDB();

// 2. Middlewares globais
app.use(cors({
  origin: '*', // Em produção, substitui por ['https://teudominio.pt']
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 3. Servir imagens estáticas da pasta "public/uploads"
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// 4. Importar rotas (caminhos já relativos à raíz do projeto)
const adminRoutes = require('./routes/adminAuth');
const courtRoutes = require('./routes/courtRoutes');
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paypalRoutes = require('./routes/paypalRoutes'); // PAYPAL

// 5. Usar rotas da API
app.use('/api/admin-auth', adminRoutes);
app.use('/api/admin/courts', courtRoutes);   // Admin courts
app.use('/api/courts', courtRoutes);         // Courts públicas
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/paypal', paypalRoutes); // PAYPAL

// 6. Rotas de resultado de pagamento (exemplo básico)
app.get('/pagamento/sucesso', (req, res) => {
  res.send('✅ Pagamento realizado com sucesso!');
});
app.get('/pagamento/cancelado', (req, res) => {
  res.send('❌ Pagamento cancelado.');
});
app.get('/paypal-cancel', (req, res) => {
  res.send('❌ Pagamento PayPal cancelado.');
});

// 7. Fallback para rotas inexistentes
app.use((req, res) => {
  console.warn(`❌ Rota não encontrada: ${req.originalUrl}`);
  res.status(404).json({ message: 'Rota não encontrada' });
});

// 8. Iniciar servidor
const PORT = process.env.PORT || 5000;
const PUBLIC_IP = process.env.PUBLIC_IP || '31.97.177.93';

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend ativo em:`);
  console.log(`   • http://localhost:${PORT}`);
  console.log(`   • http://<teu-ip-local>:${PORT} 📱`);
  console.log(`   • http://${PUBLIC_IP}:${PORT} 🌍`);
});
