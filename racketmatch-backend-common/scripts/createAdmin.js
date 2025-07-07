require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');


const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('❌ MONGO_URI não definido no .env');
  process.exit(1);
}


mongoose.connect(MONGO_URI)
  .then(async () => {
    console.log('📦 Ligado ao MongoDB');

    const existing = await Admin.findOne({ email: 'admin@racketmatch.com' });
    if (existing) {
      console.warn('⚠️ Admin já existe com este email');
      process.exit();
    }

    const newAdmin = new Admin({
      name: 'Admin Principal',
      email: 'admin@racketmatch.com',
      password: 'admin123', 
    });

    await newAdmin.save();
    console.log('✅ Admin criado com sucesso!');
    process.exit();
  })
  .catch((err) => {
    console.error('❌ Erro ao ligar ao MongoDB:', err.message);
    process.exit(1);
  });
