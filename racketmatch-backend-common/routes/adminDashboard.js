
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Match = require('../models/Match');
const Court = require('../models/Court');
const Booking = require('../models/Booking');
const Post = require('../models/Post');
const authAdmin = require('../middleware/authAdmin'); 

router.get('/dashboard', authAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const premiumUsers = await User.countDocuments({ isPremium: true });
    const totalCourts = await Court.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalOpenMatches = await Match.countDocuments({ isOpen: true });
    const totalPosts = await Post.countDocuments();

    res.json({
      users: totalUsers,
      premiumUsers,
      courts: totalCourts,
      bookings: totalBookings,
      openMatches: totalOpenMatches,
      communityPosts: totalPosts,
    });
  } catch (err) {
    console.error('Erro no dashboard:', err);
    res.status(500).json({ error: 'Erro ao carregar dados do dashboard' });
  }
});

module.exports = router;
