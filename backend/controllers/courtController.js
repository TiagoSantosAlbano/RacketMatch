const Court = require('../models/Court');


const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar quadras.' });
  }
};

const createCourt = async (req, res) => {
  try {
    const court = new Court(req.body);
    await court.save();
    res.status(201).json(court);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar quadra.' });
  }
};

module.exports = { getAllCourts, createCourt };