const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const roomController = require('../../controllers/roomController');
const auth = require('../../middleware/auth');
const checkRole = require('../../middleware/checkRole');

// @route   POST api/rooms/create
// @desc    Создание новой комнаты
// @access  Private (admin, organizer)
router.post('/create', [
  auth,
  checkRole(['admin', 'organizer']),
  check('name', 'Название комнаты обязательно').not().isEmpty(),
  check('maxPlayers', 'Укажите максимальное количество игроков').isNumeric(),
  check('time', 'Время начала обязательно').not().isEmpty(),
  check('location', 'Место проведения обязательно').not().isEmpty()
], roomController.createRoom);

// @route   GET api/rooms
// @desc    Получение списка всех комнат
// @access  Public
router.get('/', roomController.getRooms);

// @route   GET api/rooms/:id
// @desc    Получение информации о конкретной комнате
// @access  Public
router.get('/:id', roomController.getRoomById);

// @route   POST api/rooms/join/:roomId
// @desc    Присоединение к комнате
// @access  Private
router.post('/join/:roomId', auth, roomController.joinRoom);

// @route   POST api/rooms/leave/:roomId
// @desc    Выход из комнаты
// @access  Private
router.post('/leave/:roomId', auth, roomController.leaveRoom);

// @route   PUT api/rooms/:id
// @desc    Обновление информации о комнате
// @access  Private (только организатор комнаты или админ)
router.put('/:id', auth, roomController.updateRoom);

// @route   DELETE api/rooms/:id
// @desc    Удаление комнаты
// @access  Private (только организатор комнаты или админ)
router.delete('/:id', auth, roomController.deleteRoom);

module.exports = router; 