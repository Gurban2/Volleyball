const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../../controllers/userController');
const auth = require('../../middleware/auth');
const admin = require('../../middleware/admin');

// @route   POST api/users/register
// @desc    Регистрация нового пользователя
// @access  Public
router.post('/register', [
  check('username', 'Имя пользователя обязательно').not().isEmpty(),
  check('email', 'Введите корректный email').isEmail(),
  check('password', 'Пароль должен содержать не менее 6 символов').isLength({ min: 6 })
], userController.registerUser);

// @route   POST api/users/login
// @desc    Аутентификация пользователя и получение токена
// @access  Public
router.post('/login', [
  check('email', 'Введите корректный email').isEmail(),
  check('password', 'Пароль обязателен').exists()
], userController.loginUser);

// @route   GET api/users
// @desc    Получение списка пользователей
// @access  Private (только admin)
router.get('/', [auth, admin], userController.getUsers);

// @route   GET api/users/me
// @desc    Получение информации о текущем пользователе
// @access  Private
router.get('/me', auth, userController.getCurrentUser);

// @route   PUT api/users/me
// @desc    Обновление информации о пользователе
// @access  Private
router.put('/me', auth, userController.updateUser);

module.exports = router; 