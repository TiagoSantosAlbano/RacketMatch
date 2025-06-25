// backend/routes/adminCourts.js

const express = require('express');
const router = express.Router();
const Court = require('../models/Court');
const authAdmin = require('../middleware/authAdmin'); // Middleware de autenticação admin

// ✅ GET /api/admin/courts → Listar todas as quadras
router.get('/', authAdmin, async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    console.error('Erro ao buscar quadras:', err);
    res.status(500).json({ error: 'Erro ao buscar quadras' });
  }
});

// ✅ POST /api/admin/courts → Criar uma nova quadra
router.post('/', authAdmin, async (req, res) => {
  try {
    const { name, location, club } = req.body;
    const court = new Court({ name, location, club });
    await court.save();
    res.status(201).json({ message: 'Quadra criada com sucesso', court });
  } catch (err) {
    console.error('Erro ao criar quadra:', err);
    res.status(500).json({ error: 'Erro ao criar quadra' });
  }
});

// ✅ PUT /api/admin/courts/:id → Atualizar quadra
router.put('/:id', authAdmin, async (req, res) => {
  try {
    const court = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!court) return res.status(404).json({ error: 'Quadra não encontrada' });

    res.json({ message: 'Quadra atualizada com sucesso', court });
  } catch (err) {
    console.error('Erro ao atualizar quadra:', err);
    res.status(500).json({ error: 'Erro ao atualizar quadra' });
  }
});

// ✅ DELETE /api/admin/courts/:id → Remover quadra
router.delete('/:id', authAdmin, async (req, res) => {
  try {
    const court = await Court.findByIdAndDelete(req.params.id);
    if (!court) return res.status(404).json({ message: 'Quadra não encontrada.' });

    res.json({ message: 'Quadra removida com sucesso.' });
  } catch (error) {
    console.error('Erro ao apagar quadra:', error);
    res.status(500).json({ message: 'Erro ao remover quadra.' });
  }
});

module.exports = router;
