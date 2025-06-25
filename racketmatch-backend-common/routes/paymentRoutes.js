const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const attachTenantId = require('../middleware/attachTenantId');

// Aplica o middleware de Tenant em todas as rotas deste router
router.use(attachTenantId);

// Criar novo pagamento (já com tenantId)
router.post('/', async (req, res) => {
  try {
    const {
      approvedBy,
      user,
      court,
      matchPartner,
      totalPrice,
      day,
      hour,
    } = req.body;

    const commission = totalPrice * 0.15;
    const clubRevenue = totalPrice - commission;

    const payment = new Payment({
      tenantId: req.tenantId, // 🎯 aqui está o tenantId
      approvedBy,
      user,
      court,
      matchPartner,
      totalPrice,
      commission,
      clubRevenue,
      day,
      hour,
    });

    await payment.save();
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erro ao criar pagamento' });
  }
});

// Listar todos os pagamentos deste tenant
router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find({ tenantId: req.tenantId })
      .populate('user')
      .populate('court')
      .populate('matchPartner')
      .populate('approvedBy');
    res.json(payments);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar pagamentos' });
  }
});

// Obter pagamento específico deste tenant
router.get('/:id', async (req, res) => {
  try {
    const payment = await Payment.findOne({ _id: req.params.id, tenantId: req.tenantId })
      .populate('user')
      .populate('court')
      .populate('matchPartner')
      .populate('approvedBy');

    if (!payment) {
      return res.status(404).json({ message: 'Pagamento não encontrado' });
    }
    res.json(payment);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao obter pagamento' });
  }
});

module.exports = router;
