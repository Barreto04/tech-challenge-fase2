const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('URI:', process.env.MONGODB_URI);
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Erro completo:`, error);
    process.exit(1);
  }
};

module.exports = connectDB;