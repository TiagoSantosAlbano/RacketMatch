const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking'); 


router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('court')
      .populate('user')  
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter reservas', error: err });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('court')
      .populate('user');
    if (!booking) return res.status(404).json({ message: 'Reserva não encontrada' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter reserva', error: err });
  }
});


router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao criar reserva', error: err });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!booking) return res.status(404).json({ message: 'Reserva não encontrada' });
    res.json(booking);
  } catch (err) {
    res.status(400).json({ message: 'Erro ao atualizar reserva', error: err });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Reserva não encontrada' });
    res.json({ message: 'Reserva eliminada com sucesso!' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao eliminar reserva', error: err });
  }
});

module.exports = router;
