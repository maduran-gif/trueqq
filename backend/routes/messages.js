const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/:transactionId
// @desc    Obtener mensajes de una transacción
// @access  Private
router.get('/:transactionId', protect, async (req, res) => {
  try {
    const { transactionId } = req.params;

    // Verificar que el usuario sea parte de la transacción
    const transaction = await Transaction.findById(transactionId);
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    const isParticipant = 
      transaction.client.toString() === req.user._id.toString() ||
      transaction.provider.toString() === req.user._id.toString();

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver estos mensajes'
      });
    }

    // Obtener mensajes
    const messages = await Message.find({ transaction: transactionId })
      .sort({ createdAt: 1 })
      .limit(100);

    res.status(200).json({
      success: true,
      count: messages.length,
      data: messages
    });
  } catch (error) {
    console.error('Error al obtener mensajes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener mensajes',
      error: error.message
    });
  }
});

module.exports = router;