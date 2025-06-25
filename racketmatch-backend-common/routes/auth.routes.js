const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password obrigatórios' });
  }

  try {
    console.log('Novo registo:', email);
    res.status(201).json({ message: 'Conta criada com sucesso' });
  } catch (err) {
    console.error('Erro no registo:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

module.exports = router;
