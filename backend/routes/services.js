const express = require('express');
const router = express.Router();
const Service = require('../models/Service');
const Community = require('../models/Community');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   POST /api/services
// @desc    Crear un nuevo servicio
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, description, category, trueqqPrice, community } = req.body;

    // Validar campos requeridos
    if (!title || !description || !category || !trueqqPrice || !community) {
      return res.status(400).json({
        success: false,
        message: 'Por favor completa todos los campos'
      });
    }

    // Verificar que la comunidad existe
    const communityExists = await Community.findById(community);
    if (!communityExists) {
      return res.status(404).json({
        success: false,
        message: 'Comunidad no encontrada'
      });
    }

    // Crear servicio
    const service = await Service.create({
      title,
      description,
      category,
      trueqqPrice,
      community,
      provider: req.user._id,
      providerName: req.user.name
    });

    // Actualizar contador de servicios en la comunidad
    communityExists.servicesCount += 1;
    await communityExists.save();

    // Agregar servicio al usuario
    const user = await User.findById(req.user._id);
    user.servicesOffered.push(service._id);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Servicio creado exitosamente',
      data: service
    });
  } catch (error) {
    console.error('Error al crear servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear servicio',
      error: error.message
    });
  }
});

// @route   GET /api/services
// @desc    Obtener todos los servicios (con filtros opcionales)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, community, search, minPrice, maxPrice } = req.query;

    // Construir filtros
    let filters = { isActive: true };

    if (category) {
      filters.category = category;
    }

    if (community) {
      filters.community = community;
    }

    if (search) {
      filters.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      filters.trueqqPrice = {};
      if (minPrice) filters.trueqqPrice.$gte = Number(minPrice);
      if (maxPrice) filters.trueqqPrice.$lte = Number(maxPrice);
    }

    const services = await Service.find(filters)
      .populate('provider', 'name email accountType')
      .populate('community', 'name icon color')
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
      message: 'Error al obtener servicios',
      error: error.message
    });
  }
});

// @route   GET /api/services/:id
// @desc    Obtener un servicio por ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('provider', 'name email accountType trueqqBalance')
      .populate('community', 'name description icon color');

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('Error al obtener servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener servicio',
      error: error.message
    });
  }
});

// @route   PUT /api/services/:id
// @desc    Actualizar un servicio
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Verificar que el usuario es el dueño del servicio
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar este servicio'
      });
    }

    // Actualizar campos permitidos
    const { title, description, category, trueqqPrice } = req.body;

    if (title) service.title = title;
    if (description) service.description = description;
    if (category) service.category = category;
    if (trueqqPrice) service.trueqqPrice = trueqqPrice;

    await service.save();

    res.status(200).json({
      success: true,
      message: 'Servicio actualizado exitosamente',
      data: service
    });
  } catch (error) {
    console.error('Error al actualizar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar servicio',
      error: error.message
    });
  }
});

// @route   DELETE /api/services/:id
// @desc    Eliminar (desactivar) un servicio
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Servicio no encontrado'
      });
    }

    // Verificar que el usuario es el dueño del servicio
    if (service.provider.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar este servicio'
      });
    }

    // Desactivar en lugar de eliminar
    service.isActive = false;
    await service.save();

    res.status(200).json({
      success: true,
      message: 'Servicio eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar servicio:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar servicio',
      error: error.message
    });
  }
});

module.exports = router;