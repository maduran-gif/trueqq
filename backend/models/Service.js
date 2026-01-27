const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El título del servicio es requerido'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'La categoría es requerida'],
    trim: true
  },
  trueqqPrice: {
    type: Number,
    required: [true, 'El precio en Trueqqs es requerido'],
    min: [1, 'El precio debe ser mayor a 0']
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  providerName: {
    type: String,
    required: true
  },
  community: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community',
    required: [true, 'Debes seleccionar una comunidad']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    default: 5.0,
    min: 0,
    max: 5
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  timesRequested: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para búsquedas y filtros
serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ category: 1 });
serviceSchema.index({ community: 1 });
serviceSchema.index({ provider: 1 });
serviceSchema.index({ isActive: 1 });

module.exports = mongoose.model('Service', serviceSchema);