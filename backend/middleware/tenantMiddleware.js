const Tenant = require('../models/tenantModel');

const tenantMiddleware = async (req, res, next) => {
  const tenantId = req.headers['x-tenant-id'];

  if (!tenantId) {
    return res.status(400).json({ message: 'Missing tenantId' });
  }

  try {
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

    req.tenant = tenant;
    next();
  } catch (err) {
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
};

module.exports = tenantMiddleware;
