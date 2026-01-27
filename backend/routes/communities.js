const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const User = require('../models/User');
const Service = require('../models/Service');
const { protect } = require('../middleware/auth');

// @route   GET /api/communities
// @desc    Obtener todas las comunidades
// @access  Public
router.get('/', async (req, res) => {
  try {
    const communities = await Community.find({ isActive: true })
      .select('name description icon color members servicesCount')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: communities.length,
      data: communities
    });
  } catch (error) {
    console.error('Error al obtener comunidades:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comunidades',
      error: error.message
    });
  }
});

// @route   GET /api/communities/:id
// @desc    Obtener una comunidad por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('members', 'name email');

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Comunidad no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      data: community
    });
  } catch (error) {
    console.error('Error al obtener comunidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener comunidad',
      error: error.message
    });
  }
});

// @route   POST /api/communities/:id/join
// @desc    Unirse a una comunidad
// @access  Private
router.post('/:id/join', protect, async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({
        success: false,
        message: 'Comunidad no encontrada'
      });
    }

    // Verificar si ya está en la comunidad
    const alreadyMember = community.members.includes(req.user._id);

    if (alreadyMember) {
      return res.status(400).json({
        success: false,
        message: 'Ya eres miembro de esta comunidad'
      });
    }

    // Agregar usuario a la comunidad
    community.members.push(req.user._id);
    await community.save();

    // Agregar comunidad al usuario
    const user = await User.findById(req.user._id);
    user.communities.push(community._id);
    await user.save();

    res.status(200).json({
      success: true,
      message: `Te uniste exitosamente a ${community.name}`,
      data: {
        communityId: community._id,
        communityName: community.name,
        membersCount: community.members.length
      }
    });
  } catch (error) {
    console.error('Error al unirse a comunidad:', error);
    res.status(500).json({
      success: false,
      message: 'Error al unirse a la comunidad',
      error: error.message
    });
  }
});

// @route   GET /api/communities/:id/services
// @desc    Obtener servicios de una comunidad
// @access  Public
router.get('/:id/services', async (req, res) => {
  try {
    const services = await Service.find({
      community: req.params.id,
      isActive: true
    })
      .populate('provider', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: services.length,
      data: services
    });
  } catch (error) {
    console.error('Error al obtener servicios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicios de la comunidad',
      error: error.message
    });
  }
});

module.exports = router;