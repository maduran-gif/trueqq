const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre de la comunidad es requerido'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'La descripción es requerida'],
    trim: true
  },
  icon: {
    type: String,
    default: '🏘️'
  },
  color: {
    type: String,
    default: '#8B5CF6'
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  servicesCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índice para búsquedas más rápidas
communitySchema.index({ name: 1 });

module.exports = mongoose.model('Community', communitySchema);