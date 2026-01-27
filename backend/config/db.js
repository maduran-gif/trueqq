const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log('\n' + '='.repeat(50));
    console.log('✅ MongoDB Conectado Exitosamente');
    console.log('='.repeat(50));
    console.log(`📊 Base de datos: ${conn.connection.name}`);
    console.log(`🌍 Host: ${conn.connection.host}`);
    console.log('='.repeat(50) + '\n');
    
    return conn;
  } catch (error) {
    console.error('\n' + '='.repeat(50));
    console.error('❌ ERROR AL CONECTAR MONGODB');
    console.error('='.repeat(50));
    console.error(`Mensaje: ${error.message}`);
    console.error('='.repeat(50) + '\n');
    process.exit(1);
  }
};

module.exports = connectDB;