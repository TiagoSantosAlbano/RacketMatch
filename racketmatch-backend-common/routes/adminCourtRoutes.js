const express = require('express');
const router = express.Router();
const Court = require('../models/Court');


router.get('/', async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar courts', details: err });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const court = await Court.findById(req.params.id);
    if (!court) return res.status(404).json({ error: 'Court não encontrado' });
    res.json(court);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar court', details: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const newCourt = new Court(req.body);
    const savedCourt = await newCourt.save();
    res.status(201).json(savedCourt);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar court', details: err });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCourt = await Court.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedCourt) return res.status(404).json({ error: 'Court não encontrado' });
    res.json(updatedCourt);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao atualizar court', details: err });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const deletedCourt = await Court.findByIdAndDelete(req.params.id);
    if (!deletedCourt) return res.status(404).json({ error: 'Court não encontrado' });
    res.json({ message: 'Court removido com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao remover court', details: err });
  }
});

module.exports = router;
