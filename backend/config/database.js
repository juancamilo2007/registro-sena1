// database.js
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB Atlas');
  } catch (error) {
    console.error('❌ Error de conexión a MongoDB:', error);
    process.exit(1); // Detiene la app si falla la conexión
  }
};

module.exports = connectDB;
