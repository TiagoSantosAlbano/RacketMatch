
module.exports = function attachTenantId(req, res, next) {
  const tenantId = req.headers['x-tenant-id'];

  if (!tenantId) {
    return res.status(400).json({ message: 'TenantId header missing' });
  }

  req.tenantId = tenantId;
  next();
};
