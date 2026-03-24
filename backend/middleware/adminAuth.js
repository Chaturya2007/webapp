const adminAuth = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
};

module.exports = adminAuth;
