const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/reviews
// @desc    Crear una review para una transacción completada
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { transactionId, rating, comment } = req.body;

    if (!transactionId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'El ID de transacción y la calificación son requeridos'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'La calificación debe ser entre 1 y 5'
      });
    }

    // Verificar que la transacción existe
    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transacción no encontrada'
      });
    }

    // Verificar que el usuario sea el cliente de la transacción
    if (transaction.client.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Solo el cliente puede calificar este servicio'
      });
    }

    // Verificar que la transacción esté completada
    if (transaction.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Solo puedes calificar transacciones completadas'
      });
    }

    // Verificar que no exista ya una review para esta transacción
    const existingReview = await Review.findOne({ transaction: transactionId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Ya has calificado esta transacción'
      });
    }

    // Crear review
    const review = await Review.create({
      transaction: transactionId,
      service: transaction.service,
      provider: transaction.provider,
      client: req.user._id,
      rating,
      comment: comment || ''
    });

    // Actualizar rating promedio del servicio
    await updateServiceRating(transaction.service);

    res.status(201).json({
      success: true,
      message: 'Calificación enviada exitosamente',
      data: review
    });
  } catch (error) {
    console.error('Error al crear review:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear calificación',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/service/:serviceId
// @desc    Obtener todas las reviews de un servicio
// @access  Public
router.get('/service/:serviceId', async (req, res) => {
  try {
    const reviews = await Review.find({ service: req.params.serviceId })
      .populate('client', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener calificaciones',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/provider/:providerId
// @desc    Obtener todas las reviews de un proveedor
// @access  Public
router.get('/provider/:providerId', async (req, res) => {
  try {
    const reviews = await Review.find({ provider: req.params.providerId })
      .populate('client', 'name')
      .populate('service', 'title')
      .sort({ createdAt: -1 });

    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

    res.status(200).json({
      success: true,
      count: totalReviews,
      averageRating: averageRating.toFixed(1),
      data: reviews
    });
  } catch (error) {
    console.error('Error al obtener reviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener calificaciones',
      error: error.message
    });
  }
});

// @route   GET /api/reviews/transaction/:transactionId
// @desc    Obtener review de una transacción específica
// @access  Private
router.get('/transaction/:transactionId', protect, async (req, res) => {
  try {
    const review = await Review.findOne({ transaction: req.params.transactionId })
      .populate('client', 'name')
      .populate('provider', 'name');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'No se encontró calificación para esta transacción'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error al obtener review:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener calificación',
      error: error.message
    });
  }
});

// Función auxiliar para actualizar el rating de un servicio
async function updateServiceRating(serviceId) {
  try {
    const reviews = await Review.find({ service: serviceId });
    const totalReviews = reviews.length;
    
    if (totalReviews > 0) {
      const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
      await Service.findByIdAndUpdate(serviceId, {
        rating: averageRating.toFixed(1)
      });
    }
  } catch (error) {
    console.error('Error al actualizar rating del servicio:', error);
  }
}

module.exports = router;