import { Router } from 'express';
const router = Router();

router.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e password obrigatórios' });
  }

  try {
    // Aqui irias guardar na base de dados (MongoDB, etc)
    // Simulação apenas:
    console.log('Novo registo:', email);
    res.status(201).json({ message: 'Conta criada com sucesso' });
  } catch (err) {
    console.error('Erro no registo:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

export default router;
