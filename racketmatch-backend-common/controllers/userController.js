const User = require('../models/User');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    console.log('🟢 USERS ENCONTRADOS:', users);
    res.json(users);
  } catch (error) {
    console.error('🔴 ERRO AO BUSCAR USERS:', error);
    res.status(500).json({ message: 'Erro ao encontrar utilizadores.' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar utilizador.' });
  }
};

module.exports = { getAllUsers, createUser };