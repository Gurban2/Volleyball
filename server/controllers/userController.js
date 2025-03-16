const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('../config/default');

// Регистрация нового пользователя
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Проверка существования пользователя
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Пользователь с таким email уже существует' });
    }

    // Проверка уникальности имени пользователя
    user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: 'Пользователь с таким именем уже существует' });
    }

    user = new User({
      username,
      email,
      password
    });

    await user.save();

    // Создание JWT токена
    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload, 
      config.jwtSecret,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Аутентификация пользователя
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Неверные учетные данные' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    jwt.sign(
      payload, 
      config.jwtSecret,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение списка пользователей (только для админа)
exports.getUsers = async (req, res) => {
  try {
    // Проверка роли пользователя
    if (req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Доступ запрещен' });
    }

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Получение информации о текущем пользователе
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('-password')
      .populate('joinedRooms', 'name time location');
    
    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
};

// Обновление информации о пользователе
exports.updateUser = async (req, res) => {
  try {
    const { username, profileImage } = req.body;
    
    // Создание объекта обновления
    const updateFields = {};
    if (username) {
      // Проверка уникальности имени пользователя
      const existingUser = await User.findOne({ username });
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({ msg: 'Пользователь с таким именем уже существует' });
      }
      updateFields.username = username;
    }
    if (profileImage) updateFields.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateFields },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ msg: 'Пользователь не найден' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Ошибка сервера');
  }
}; 