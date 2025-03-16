module.exports = function(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ msg: 'Требуется авторизация' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    next();
  };
}; 