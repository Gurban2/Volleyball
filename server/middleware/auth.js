const jwt = require('jsonwebtoken');
const config = require('../config/default');

module.exports = function(req, res, next) {
  // Получение токена из заголовка
  let token = req.header('x-auth-token');
  
  // Проверка наличия токена в заголовке Authorization
  if (!token && req.header('Authorization')) {
    // Получение токена из Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    if (authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7, authHeader.length);
    }
  }

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
    console.error('Ошибка проверки токена:', err.message);
    res.status(401).json({ msg: 'Недействительный токен' });
  }
}; 