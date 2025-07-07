const express = require('express');
const router = express.Router();
const Tenant = require('../models/Tenant');


router.post('/', async (req, res) => {
  try {
    const { name, email, phone, commissionRate } = req.body;

    const tenant = new Tenant({
      name,
      email,
      phone,
      commissionRate: commissionRate || 15,
    });

    await tenant.save();
    res.status(201).json(tenant);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar tenant' });
  }
});

router.get('/', async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.json(tenants);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar tenants' });
  }
});


router.get('/:id', async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant não encontrado' });
    }
    res.json(tenant);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter tenant' });
  }
});

module.exports = router;
