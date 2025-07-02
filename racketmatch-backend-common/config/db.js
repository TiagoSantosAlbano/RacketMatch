const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // DEBUG: Mostra o valor recebido da variável de ambiente!
    console.log('Mongo URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
