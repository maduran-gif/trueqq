const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/transactions/request
// @desc    Solicitar un servicio (crear transacción)
// @access  Private
router.post('/request', protect, async (req, res) => {
  try {
    const { serviceId } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        success: false,
        message: 'El ID del servicio es requerido'
      });
    }

    // Obtener el servicio
    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    if (!service.isActive) {
      return res.status(400).json({
        success: false,
        message: 'Este servicio no está disponible'
      });
    }

    // Verificar que no sea el propio servicio
    if (service.provider.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'No puedes solicitar tu propio servicio'
      });
    }

    // Obtener cliente y proveedor
    const client = await User.findById(req.user._id);
    const provider = await User.findById(service.provider);

    // Verificar que el cliente tenga suficientes Trueqqs
    if (client.trueqqBalance < service.trueqqPrice) {
      return res.status(400).json({
        success: false,
        message: `No tienes suficientes Trueqqs. Necesitas ${service.trueqqPrice} pero solo tienes ${client.trueqqBalance}`
      });
    }

    // Crear transacción
    const transaction = await Transaction.create({
      service: service._id,
      serviceTitle: service.title,
      provider: provider._id,
      providerName: provider.name,
      client: client._id,
      clientName: client.name,
      trueqqAmount: service.trueqqPrice,
      status: 'completed',
      chatActive: true,
      completedAt: new Date()
    });

    // Transferir Trueqqs: restar al cliente, sumar al proveedor
    client.trueqqBalance -= service.trueqqPrice;
    provider.trueqqBalance += service.trueqqPrice;

    await client.save();
    await provider.save();

    // Actualizar estadísticas del servicio
    service.timesRequested += 1;
    await service.save();

    res.status(201).json({
      success: true,
      message: '¡Servicio solicitado exitosamente! Se han descontado los Trueqqs de tu billetera.',
      data: {
        transaction,
        newBalance: client.trueqqBalance,
        trueqqsTransferred: service.trueqqPrice
      }
    });
  } catch (error) {
    console.error('Error al solicitar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al solicitar servicio',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/my-transactions
// @desc    Obtener historial de transacciones del usuario
// @access  Private
router.get('/my-transactions', protect, async (req, res) => {
  try {
    const { type } = req.query; // 'received' o 'sent'

    let filters = {};

    if (type === 'received') {
      // Transacciones donde soy el proveedor (recibí Trueqqs)
      filters.provider = req.user._id;
    } else if (type === 'sent') {
      // Transacciones donde soy el cliente (envié Trueqqs)
      filters.client = req.user._id;
    } else {
      // Todas mis transacciones
      filters.$or = [
        { client: req.user._id },
        { provider: req.user._id }
      ];
    }

    const transactions = await Transaction.find(filters)
      .populate('service', 'title category')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions
    });
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacciones',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/:id
// @desc    Obtener detalle de una transacción
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
      .populate('service', 'title description category trueqqPrice')
      .populate('provider', 'name email')
      .populate('client', 'name email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    // Verificar que el usuario sea parte de la transacción
    const isParticipant = 
      transaction.client._id.toString() === req.user._id.toString() ||
      transaction.provider._id.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta transacción'
      });
    }

    res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    console.error('Error al obtener transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener transacción',
      error: error.message
    });
  }
});

// @route   PUT /api/transactions/:id/complete
// @desc    Marcar transacción como completada
// @access  Private
router.put('/:id/complete', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    // Verificar que el usuario sea el proveedor
    if (transaction.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Solo el proveedor puede marcar la transacción como completada'
      });
    }

    if (transaction.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Esta transacción ya está completada'
      });
    }

    transaction.status = 'completed';
    transaction.completedAt = new Date();
    await transaction.save();

    res.status(200).json({
      success: true,
      message: 'Transacción completada exitosamente',
      data: transaction
    });
  } catch (error) {
    console.error('Error al completar transacción:', error);
    res.status(500).json({
      success: false,
      message: 'Error al completar transacción',
      error: error.message
    });
  }
});

// @route   GET /api/transactions/stats
// @desc    Obtener estadísticas de transacciones del usuario
// @access  Private
router.get('/stats/summary', protect, async (req, res) => {
  try {
    // Transacciones como cliente (gastos)
    const sentTransactions = await Transaction.find({ 
      client: req.user._id,
      status: 'completed'
    });

    // Transacciones como proveedor (ingresos)
    const receivedTransactions = await Transaction.find({ 
      provider: req.user._id,
      status: 'completed'
    });

    const totalSent = sentTransactions.reduce((sum, t) => sum + t.trueqqAmount, 0);
    const totalReceived = receivedTransactions.reduce((sum, t) => sum + t.trueqqAmount, 0);

    res.status(200).json({
      success: true,
      data: {
        totalSent,
        totalReceived,
        sentCount: sentTransactions.length,
        receivedCount: receivedTransactions.length,
        currentBalance: req.user.trueqqBalance
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
});

module.exports = router;