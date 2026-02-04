const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

const connectDB = require('./config/db');
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://trueqq.vercel.app'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

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

// Rutas de reviews
app.use('/api/reviews', require('./routes/reviews'));

// Rutas de notificaciones
app.use('/api/notifications', require('./routes/notifications'));

// Rutas de mensajes
app.use('/api/messages', require('./routes/messages'));

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

// ============================================
// SOCKET.IO - CHAT EN TIEMPO REAL
// ============================================

const Message = require('./models/Message');
const Transaction = require('./models/Transaction');
const { createNotification } = require('./routes/notifications');

io.on('connection', (socket) => {
  console.log('✅ Usuario conectado:', socket.id);

  // Usuario se une a una sala de chat (por transacción)
  socket.on('join_chat', async (data) => {
    const { transactionId, userId } = data;
    
    try {
      // Verificar que el usuario sea parte de la transacción
      const transaction = await Transaction.findById(transactionId);
      
      if (!transaction) {
        socket.emit('error', { message: 'Transacción no encontrada' });
        return;
      }

      const isParticipant = 
        transaction.client.toString() === userId ||
        transaction.provider.toString() === userId;

      if (!isParticipant) {
        socket.emit('error', { message: 'No tienes permiso para este chat' });
        return;
      }

      // Unirse a la sala
      socket.join(transactionId);
      console.log(`Usuario ${userId} se unió al chat ${transactionId}`);

      // Enviar mensajes previos
      const messages = await Message.find({ transaction: transactionId })
        .sort({ createdAt: 1 })
        .limit(100);

      socket.emit('previous_messages', messages);
    } catch (error) {
      console.error('Error al unirse al chat:', error);
      socket.emit('error', { message: 'Error al unirse al chat' });
    }
  });

  // Enviar mensaje
  socket.on('send_message', async (data) => {
    const { transactionId, userId, userName, content } = data;

    try {
      // Crear mensaje en la BD
      const message = await Message.create({
        transaction: transactionId,
        sender: userId,
        senderName: userName,
        content
      });

      // Enviar a todos en la sala
      io.to(transactionId).emit('new_message', message);

      // Crear notificación para el destinatario
      const transaction = await Transaction.findById(transactionId);
      const recipientId = transaction.client.toString() === userId 
        ? transaction.provider.toString() 
        : transaction.client.toString();

      await createNotification({
        user: recipientId,
        type: 'service_request',
        title: '💬 Nuevo mensaje',
        message: `${userName} te envió un mensaje`,
        relatedTransaction: transactionId
      });

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      socket.emit('error', { message: 'Error al enviar mensaje' });
    }
  });

  // Usuario escribiendo
  socket.on('typing', (data) => {
    const { transactionId, userName } = data;
    socket.to(transactionId).emit('user_typing', { userName });
  });

  // Desconexión
  socket.on('disconnect', () => {
    console.log('❌ Usuario desconectado:', socket.id);
  });
});

// Iniciar servidor
server.listen(PORT, '0.0.0.0', () => {
  console.log('\n' + '='.repeat(50));
  console.log('🚀 SERVIDOR TRUEQQ INICIADO');
  console.log('='.repeat(50));
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 URL: http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/api/test`);
  console.log(`💬 Socket.io activado`);
  console.log('='.repeat(50) + '\n');
});