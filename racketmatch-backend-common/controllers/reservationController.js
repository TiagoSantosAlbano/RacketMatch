const Reservation = require('../models/Reservation');


const getUserReservations = async (req, res) => {
  try {
    const userId = req.user._id;
    const reservations = await Reservation.find({ user: userId })
      .populate('court', 'name location') 
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao procurar reservas.' });
  }
};

module.exports = {
  getUserReservations
};
