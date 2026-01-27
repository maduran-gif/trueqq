const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();
const connectDB = require('./config/db');
connectDB();
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.get('/', (req, res) => {
  res.json({
    message: '🚀 Bienvenido a Trueqq API',
    version: '1.0.0',
    status: 'online'
  });
});

app.get('/api/test', (req, res) => {
  res.json({
    message: '✅ Trueqq API funcionando correctamente',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});
// ============================================
// RUTAS DE LA API
// ============================================

// Rutas de autenticación
app.use('/api/auth', require('./routes/auth'));

// Rutas de comunidades
app.use('/api/communities', require('./routes/communities'));

// Rutas de servicios
app.use('/api/services', require('./routes/services'));

// Rutas de transacciones
app.use('/api/transactions', require('./routes/transactions'));
// Ruta 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '❌ Ruta no encontrada',
    path: req.originalUrl
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Error del servidor'
  });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVIDOR TRUEQQ INICIADO');
  console.log('='.repeat(50));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log('='.repeat(50) + '\n');
});