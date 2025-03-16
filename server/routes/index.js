const express = require('express');
const router = express.Router();

// Импорт маршрутов API
router.use('/api/users', require('./api/users'));
router.use('/api/rooms', require('./api/rooms'));

module.exports = router; 