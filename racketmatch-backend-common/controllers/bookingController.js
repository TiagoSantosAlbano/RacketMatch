const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  try {
    const { courtId, date, time } = req.body;
    const userId = req.user.id;

    if (!courtId || !date) {
      return res.status(400).json({ message: 'Campo quadra e data são obrigatórios.' });
    }

    const newBooking = new Booking({
      userId,
      court: courtId,
      date,
      time,
      status: 'ativa'
    });

    await newBooking.save();
    await newBooking.populate('court');

    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('court')
      .sort({ date: -1 });

    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Para admin/debug: buscar todas as reservas
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('court')
      .populate('userId', 'name email')
      .sort({ date: -1 });
    res.json(bookings);
  } catch (error) {
    console.error('Erro ao buscar todas as reservas:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

// Cancelar reserva
const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const booking = await Booking.findOne({ _id: id, userId });

    if (!booking) {
      return res.status(404).json({ message: 'Reserva não encontrada.' });
    }

    if (booking.status === 'cancelada') {
      return res.status(400).json({ message: 'Reserva já está cancelada.' });
    }

    booking.status = 'cancelada';
    await booking.save();
    await booking.populate('court');

    res.json({ message: 'Reserva cancelada com sucesso.', booking });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    res.status(500).json({ message: 'Erro no servidor.' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  cancelBooking
};
