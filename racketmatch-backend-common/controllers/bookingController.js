// controllers/bookingController.js
const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { clubId, date, time } = req.body;
    const userId = req.user.id;

    if (!clubId || !date || !time) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    const newBooking = new Booking({ userId, clubId, date, time });
    await newBooking.save();

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Erro ao criar marcação:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).populate('clubId');
    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar marcações:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = { createBooking, getUserBookings };
