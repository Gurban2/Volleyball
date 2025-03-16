const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const auth = require('../../middleware/auth');

// Настройка хранилища для multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Создаем папку uploads, если она не существует
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Если указан путь, создаем подпапку
    if (req.body.path) {
      const userDir = path.join(uploadsDir, req.body.path.replace(/\//g, '_'));
      if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
      }
      return cb(null, userDir);
    }
    
    cb(null, uploadsDir);
  },
  filename: function(req, file, cb) {
    // Генерируем уникальное имя файла
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// Фильтр для разрешенных типов файлов (изображения)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Недопустимый тип файла. Разрешены только изображения.'), false);
  }
};

// Настройка multer
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Лимит 5MB
  }
});

// @route   POST api/upload
// @desc    Загрузка файла
// @access  Private
router.post('/', auth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Файл не загружен' });
    }
    
    // Относительный путь к файлу для доступа через веб
    const relativePath = req.file.path.split('uploads')[1].replace(/\\/g, '/');
    const fileUrl = `/uploads${relativePath}`;
    
    res.json({ 
      message: 'Файл успешно загружен',
      fileUrl: fileUrl,
      fileName: req.file.filename
    });
  } catch (error) {
    console.error('Ошибка при загрузке файла:', error);
    res.status(500).json({ message: 'Ошибка сервера при загрузке файла' });
  }
});

module.exports = router; 