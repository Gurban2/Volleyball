const mongoose = require('mongoose');
const config = require('./default');

const connectDB = async () => {
  try {
    await mongoose.connect(config.mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('MongoDB подключена...');
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err.message);
    // Выход из процесса с ошибкой
    process.exit(1);
  }
};

module.exports = connectDB; 