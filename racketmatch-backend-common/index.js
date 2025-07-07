const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./db');
const authMiddleware = require('./middleware/authMiddleware');

const app = express();

console.log('Mongo URI:', process.env.MONGODB_URI || process.env.MONGO_URI);
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Porta configurada:', process.env.PORT);

connectDB();


app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false 
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// --- Rotas ---
const courtRoutes = require('./routes/courtRoutes');
const matchRoutes = require('./routes/matchRoutes');
const userRoutes = require('./routes/userRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const premiumRoutes = require('./routes/premiumRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const paypalRoutes = require('./routes/paypalRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const adminRoutes = require('./routes/adminAuth');
const adminUserRoutes = require('./routes/adminUserRoutes');
const adminMatchRoutes = require('./routes/adminMatchRoutes');
const adminBookingRoutes = require('./routes/adminBookingRoutes');
const adminCourtRoutes = require('./routes/adminCourtRoutes');

app.use('/api/admin-auth', adminRoutes);

app.use('/api/courts', courtRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/reservations', reservationRoutes);

app.use('/api/admin/courts', adminCourtRoutes);
app.use('/api/admin/matches', adminMatchRoutes);
app.use('/api/admin/users', adminUserRoutes);
app.use('/api/admin/bookings', adminBookingRoutes);

app.get('/pagamento/sucesso', (req, res) => {
  res.send('✅ Pagamento realizado com sucesso!');
});
app.get('/pagamento/cancelado', (req, res) => {
  res.send('❌ Pagamento cancelado.');
});
app.get('/paypal-cancel', (req, res) => {
  res.send('❌ Pagamento PayPal cancelado.');
});

const PORT = process.env.PORT || 5000;
const PUBLIC_IP = '31.97.177.93'; 

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend ativo em:`);
  console.log(`   • http://localhost:${PORT}`);
  console.log(`   • http://127.0.0.1:${PORT}`);
  console.log(`   • http://${PUBLIC_IP}:${PORT} 🌍 `);
});
