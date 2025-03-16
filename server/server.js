const express = require('express');
// Загрузка переменных окружения должна происходить ДО импорта конфигурации
require('dotenv').config();
const connectDB = require('./config/db');
const cors = require('cors');
const config = require('./config/default');
const path = require('path');

const app = express();

// Подключение к базе данных
connectDB();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors());

// Обслуживание статических файлов из папки uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Определение маршрутов
app.use('/api/users', require('./routes/api/users'));
app.use('/api/rooms', require('./routes/api/rooms'));
app.use('/api/upload', require('./routes/api/upload'));

// Простой маршрут для проверки
app.get('/', (req, res) => res.send('API запущен'));

// Запуск сервера
const PORT = config.port;
app.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`)); 