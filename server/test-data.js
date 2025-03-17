const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Room = require('./models/Room');
require('dotenv').config();

// Функция для загрузки тестовых данных
const loadTestData = async () => {
  try {
    // Подключение к MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB подключена для загрузки тестовых данных...');

    // Очистка существующих коллекций
    await User.deleteMany({});
    await Room.deleteMany({});
    console.log('Существующие данные удалены');

    // Хеширование пароля для тестовых пользователей
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Создание тестовых пользователей
    const admin = await User.create({
      username: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin'
    });

    const organizer = await User.create({
      username: 'organizer',
      email: 'organizer@example.com',
      password: hashedPassword,
      role: 'organizer'
    });

    const user1 = await User.create({
      username: 'player1',
      email: 'player1@example.com',
      password: hashedPassword,
      role: 'user'
    });

    const user2 = await User.create({
      username: 'player2',
      email: 'player2@example.com',
      password: hashedPassword,
      role: 'user'
    });

    console.log('Тестовые пользователи созданы');

    // Создание тестовых комнат
    const room1 = await Room.create({
      name: 'Волейбол в парке',
      organizer: organizer._id,
      maxPlayers: 12,
      time: new Date(Date.now() + 86400000), // завтра
      location: 'Центральный парк',
      type: 'public',
      description: 'Дружеская игра в волейбол в центральном парке',
      players: [organizer._id, user1._id],
      status: 'upcoming'
    });

    const room2 = await Room.create({
      name: 'Тренировка по волейболу',
      organizer: organizer._id,
      maxPlayers: 16,
      time: new Date(Date.now() + 172800000), // через 2 дня
      location: 'Спортивный центр "Олимп"',
      type: 'public',
      description: 'Тренировка для игроков любого уровня',
      players: [organizer._id, user1._id, user2._id],
      status: 'upcoming'
    });

    const room3 = await Room.create({
      name: 'Приватная игра',
      organizer: admin._id,
      maxPlayers: 8,
      time: new Date(Date.now() + 259200000), // через 3 дня
      location: 'Пляж',
      type: 'private',
      description: 'Только для приглашенных игроков',
      players: [admin._id, user2._id],
      status: 'upcoming'
    });

    console.log('Тестовые комнаты созданы');

    // Обновление пользователей - добавление комнат
    await User.findByIdAndUpdate(organizer._id, {
      $push: { joinedRooms: [room1._id, room2._id] }
    });

    await User.findByIdAndUpdate(user1._id, {
      $push: { joinedRooms: [room1._id, room2._id] }
    });

    await User.findByIdAndUpdate(user2._id, {
      $push: { joinedRooms: [room2._id, room3._id] }
    });

    await User.findByIdAndUpdate(admin._id, {
      $push: { joinedRooms: [room3._id] }
    });

    console.log('Пользователи обновлены');
    console.log('Тестовые данные успешно загружены');

    // Отображение данных для проверки
    console.log('\nСписок пользователей:');
    const users = await User.find({}).select('-password');
    console.log(users);

    console.log('\nСписок комнат:');
    const rooms = await Room.find({});
    console.log(rooms);

  } catch (err) {
    console.error('Ошибка при загрузке тестовых данных:', err);
  } finally {
    // Завершение процесса
    process.exit();
  }
};

// Запуск загрузки данных
loadTestData(); 