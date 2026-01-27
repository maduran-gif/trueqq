const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, generateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Registrar un nuevo usuario
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;

    // Validar que todos los campos estén presentes
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completa todos los campos'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      accountType: accountType || 'free'
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        trueqqBalance: user.trueqqBalance,
        token
      }
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message
    });
  }
});

// @route   POST /api/auth/login
// @desc    Iniciar sesión
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor ingresa email y contraseña'
      });
    }

    // Buscar usuario (incluyendo password para comparar)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'Inicio de sesión exitoso',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        trueqqBalance: user.trueqqBalance,
        token
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: 'Error al iniciar sesión',
      error: error.message
    });
  }
});

// @route   GET /api/auth/me
// @desc    Obtener datos del usuario autenticado
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('communities', 'name icon color')
      .populate('servicesOffered', 'title trueqqPrice');

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        trueqqBalance: user.trueqqBalance,
        communities: user.communities,
        servicesOffered: user.servicesOffered,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener perfil',
      error: error.message
    });
  }
});

module.exports = router;