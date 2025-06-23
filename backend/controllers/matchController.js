const Match = require('../models/Match');
const User = require('../models/User');

// Buscar todas as partidas
const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    res.status(500).json({ message: 'Erro ao buscar partidas.' });
  }
};

// Criar nova partida
const createMatch = async (req, res) => {
  try {
    const match = new Match(req.body);
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    console.error('Erro ao criar partida:', error);
    res.status(500).json({ message: 'Erro ao criar partida.' });
  }
};

// Matchmaking com Premium + Geolocalização + Habilidade + Horário
const getPremiumMatchSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || !currentUser.location) {
      return res.status(400).json({ message: 'Utilizador não tem localização definida.' });
    }

    const users = await User.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: currentUser.location.coordinates,
          },
          distanceField: 'distance',
          maxDistance: 30000, // 30 km
          spherical: true,
          key: 'location',
        },
      },
      {
        $match: {
          _id: { $ne: currentUser._id },
          preferredTimes: { $in: currentUser.preferredTimes || [] },
          skill_level: {
            $gte: currentUser.skill_level - 1,
            $lte: currentUser.skill_level + 1,
          },
        },
      },
      {
        $sort: { isPremium: -1, distance: 1 }, // Premiums e mais próximos primeiro
      },
      {
        $project: {
          password: 0,
        },
      },
    ]);

    res.json(users);
  } catch (error) {
    console.error('Erro no matchmaking:', error);
    res.status(500).json({ message: 'Erro ao buscar sugestões de partidas.' });
  }
};

module.exports = {
  getAllMatches,
  createMatch,
  getPremiumMatchSuggestions,
};
