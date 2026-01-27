const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar JWT
const protect = async (req, res, next) => {
  let token;

  // Verificar si el token existe en los headers
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Obtener token del header
      token = req.headers.authorization.split(' ')[1];

      // Verificar token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Obtener usuario del token (sin la contraseña)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Usuario no encontrado'
        });
      }

      next();
    } catch (error) {
      console.error('Error en autenticación:', error);
      return res.status(401).json({
        success: false,
        message: 'No autorizado, token inválido'
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado, no hay token'
    });
  }
};

// Generar JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

module.exports = { protect, generateToken };