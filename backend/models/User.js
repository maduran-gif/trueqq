const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor ingresa tu nombre'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor ingresa tu email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Por favor ingresa un email válido']
  },
  password: {
    type: String,
    required: [true, 'Por favor ingresa una contraseña'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  accountType: {
    type: String,
    enum: ['free', 'freemium', 'premium'],
    default: 'free'
  },
  trueqqBalance: {
    type: Number,
    default: function() {
      if (this.accountType === 'free') return 0;
      if (this.accountType === 'freemium') return 500;
      if (this.accountType === 'premium') return 500;
      return 0;
    }
  },
  communities: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Community'
  }],
  servicesOffered: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function() {
  if (!this.isModified('password')) {
    return;
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);