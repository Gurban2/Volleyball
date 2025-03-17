const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = function(req, res, next) {
  // Проверка наличия пользователя (должен быть установлен в auth middleware)
  if (!req.user) {
    return res.status(401).json({ msg: 'Не авторизован' });
  }

  // Проверка роли пользователя
  if (req.user.role !== 'admin') {
    return res.status(403).json({ msg: 'Доступ запрещен. Требуются права администратора' });
  }

  // Если пользователь админ, пропускаем запрос дальше
  next();
}; 