const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = function(req, res, next) {
  // Получение токена из заголовка
  const token = req.header('x-auth-token');

  // Проверка наличия токена
  if (!token) {
    return res.status(401).json({ msg: 'Токен отсутствует, авторизация отклонена' });
  }

  try {
    // Верификация токена
    const decoded = jwt.verify(token, config.jwtSecret);

    // Добавление информации о пользователе в request
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Недействительный токен' });
  }
}; 