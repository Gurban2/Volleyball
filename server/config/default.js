module.exports = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET || 'mysecrettoken',
  port: process.env.PORT || 5000
}; 