const Court = require('../models/Court');
const path = require('path');

// GET all courts
const getAllCourts = async (req, res) => {
  try {
    const courts = await Court.find();
    res.json(courts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar quadras.' });
  }
};

// POST create court
const createCourt = async (req, res) => {
  try {
    const { name, location, type, price } = req.body;
    const parsedType = Array.isArray(type) ? type : [type];
    const parsedPrice = price ? parseFloat(price) : 0;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const court = new Court({
      name,
      location,
      type: parsedType,
      price: parsedPrice,
      image,
    });

    const savedCourt = await court.save();
    res.status(201).json({ court: savedCourt });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao criar quadra.' });
  }
};

// PUT update court
const updateCourt = async (req, res) => {
  try {
    const { name, location, type, price } = req.body;
    const updateData = {
      name,
      location,
      type: Array.isArray(type) ? type : [type],
      price: price ? parseFloat(price) : 0,
    };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await Court.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ message: 'Quadra não encontrada.' });
    }

    res.json({ court: updated });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar quadra.' });
  }
};

// DELETE court
const deleteCourt = async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao excluir quadra.' });
  }
};

module.exports = {
  getAllCourts,
  createCourt,
  updateCourt,
  deleteCourt,
};
