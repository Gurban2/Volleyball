const Room = require('../models/Room');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Создание новой комнаты
exports.createRoom = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, maxPlayers, time, location, type, description } = req.body;

  try {
    const newRoom = new Room({
      name,
      organizer: req.user.id,
      maxPlayers,
      time,
      location,
      type: type || 'public',
      description,
      players: [req.user.id] // Организатор автоматически становится игроком
    });

    const room = await newRoom.save();

    // Добавляем комнату в список joinedRooms пользователя
    await User.findByIdAndUpdate(
      req.user.id,
      { $push: { joinedRooms: room._id } }
    );

    // Возвращаем комнату с заполненными данными
    const populatedRoom = await Room.findById(room._id)
      .populate('organizer', 'username profileImage')
      .populate('players', 'username profileImage');

    res.json(populatedRoom);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение списка всех комнат
exports.getRooms = async (req, res) => {
  try {
    // Добавляем возможность фильтрации и поиска
    const { status, type, search } = req.query;
    
    // Создаем фильтр
    const filter = {};
    if (status) filter.status = status;
    if (type) filter.type = type;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const rooms = await Room.find(filter)
      .populate('organizer', 'username profileImage')
      .populate('players', 'username profileImage')
      .sort({ time: 1 })
      .lean(); // Оптимизация: возвращаем простой JSON

    res.json(rooms);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение информации о конкретной комнате
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('organizer', 'username profileImage')
      .populate('players', 'username profileImage')
      .lean();

    if (!room) {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }

    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Присоединение к комнате
exports.joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }

    // Проверка, не заполнена ли комната
    if (room.players.length >= room.maxPlayers) {
      return res.status(400).json({ msg: 'Комната заполнена' });
    }

    // Проверка, не присоединился ли пользователь уже
    if (room.players.some(player => player.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Вы уже присоединились к этой комнате' });
    }

    // Добавление пользователя в комнату
    room.players.push(req.user.id);
    await room.save();

    // Добавление комнаты в список joinedRooms пользователя
    try {
      await User.findByIdAndUpdate(
        req.user.id,
        { $push: { joinedRooms: room._id } }
      );
    } catch (userUpdateErr) {
      // Откат изменений комнаты, если не удалось обновить пользователя
      room.players = room.players.filter(p => p.toString() !== req.user.id);
      await room.save();
      throw userUpdateErr; // Перебрасываем ошибку в основной catch
    }

    // Заполняем данные прямо в существующей модели
    await room.populate([
      { path: 'organizer', select: 'username profileImage' },
      { path: 'players', select: 'username profileImage' }
    ]);

    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Выход из комнаты
exports.leaveRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }

    // Проверка, присоединился ли пользователь к комнате
    if (!room.players.some(player => player.toString() === req.user.id)) {
      return res.status(400).json({ msg: 'Вы не присоединялись к этой комнате' });
    }

    // Если пользователь организатор, нельзя выйти
    if (room.organizer.toString() === req.user.id) {
      return res.status(400).json({ msg: 'Организатор не может покинуть комнату' });
    }

    // Удаление пользователя из комнаты
    room.players = room.players.filter(
      player => player.toString() !== req.user.id
    );
    await room.save();

    // Удаление комнаты из списка joinedRooms пользователя
    try {
      await User.findByIdAndUpdate(
        req.user.id,
        { $pull: { joinedRooms: room._id } }
      );
    } catch (userUpdateErr) {
      // Откат изменений комнаты, если не удалось обновить пользователя
      room.players.push(req.user.id);
      await room.save();
      throw userUpdateErr; // Перебрасываем ошибку в основной catch
    }

    // Заполняем данные прямо в существующей модели
    await room.populate([
      { path: 'organizer', select: 'username profileImage' },
      { path: 'players', select: 'username profileImage' }
    ]);

    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление информации о комнате
exports.updateRoom = async (req, res) => {
  const { name, maxPlayers, time, location, type, description, status } = req.body;

  // Создание объекта обновления
  const roomFields = {};
  if (name) roomFields.name = name;
  if (maxPlayers) roomFields.maxPlayers = maxPlayers;
  if (time) roomFields.time = time;
  if (location) roomFields.location = location;
  if (type) roomFields.type = type;
  if (description) roomFields.description = description;
  if (status) roomFields.status = status;

  try {
    let room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }

    // Проверка прав на редактирование (только организатор или админ)
    if (room.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    // Проверка, не уменьшаем ли maxPlayers ниже текущего количества игроков
    if (maxPlayers && maxPlayers < room.players.length) {
      return res.status(400).json({ 
        msg: `Нельзя установить максимальное количество игроков меньше текущего числа участников (${room.players.length})` 
      });
    }

    room = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: roomFields },
      { new: true }
    ).populate('organizer', 'username profileImage')
      .populate('players', 'username profileImage');

    res.json(room);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
};

// Удаление комнаты
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }

    // Проверка прав на удаление (только организатор или админ)
    if (room.organizer.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    // Удаление комнаты из списка joinedRooms всех участников
    try {
      for (const playerId of room.players) {
        await User.findByIdAndUpdate(
          playerId,
          { $pull: { joinedRooms: room._id } }
        );
      }
    } catch (userUpdateErr) {
      console.error('Ошибка при обновлении пользователей:', userUpdateErr);
      // Продолжаем удалять комнату даже если не удалось обновить пользователей
    }

    await Room.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Комната удалена' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Комната не найдена' });
    }
    res.status(500).send('Ошибка сервера');
  }
}; 