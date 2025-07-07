const Match = require('../models/Match');
const User = require('../models/User');


const getAllMatches = async (req, res) => {
  try {
    const matches = await Match.find().populate('players', '_id name email');
    res.json(matches);
  } catch (error) {
    console.error('❌ Erro ao procurar partidas:', error);
    res.status(500).json({ message: 'Erro ao procurar partidas.' });
  }
};


const createMatch = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilizador não autenticado.' });
    }
    const { _id: userId, tenantId } = req.user;
    const { match_date, match_time, court_name, court_location } = req.body;

    const match = new Match({
      title: `Jogo aberto ${court_name} em ${court_location}`,
      location: court_location,
      date: match_date,
      hour: match_time,
      createdBy: userId,
      players: [userId],
      tenantId,
    });

    await match.save();
    res.status(201).json(match);
  } catch (error) {
    console.error('❌ Erro ao criar partida:', error);
    res.status(500).json({ message: 'Erro ao criar partida.' });
  }
};


const joinMatch = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilizador não autenticado.' });
    }
    const { matchId } = req.params;
    const userId = req.user._id;

    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Jogo não encontrado.' });

    if (match.players.map(p => p.toString()).includes(userId.toString())) {
      return res.status(400).json({ message: 'Já estás neste jogo.' });
    }

    if (match.players.length >= 4) {
      return res.status(400).json({ message: 'Jogo cheio.' });
    }

    match.players.push(userId);
    await match.save();

    res.json({ message: 'Entraste no jogo!', match });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao entrar no jogo.' });
  }
};


const getPremiumMatchSuggestions = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser || !currentUser.location) {
      return res.status(400).json({ message: 'Utilizador não tem localização definida.' });
    }
    const users = await User.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: currentUser.location.coordinates },
          distanceField: 'distance',
          maxDistance: 30000,
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
      { $sort: { isPremium: -1, distance: 1 } },
      { $project: { password: 0 } },
    ]);
    res.json(users);
  } catch (error) {
    console.error('❌ Erro no matchmaking:', error);
    res.status(500).json({ message: 'Erro ao procurar sugestões de partidas.' });
  }
};

module.exports = {
  getAllMatches,
  createMatch,
  getPremiumMatchSuggestions,
  joinMatch, 
};
