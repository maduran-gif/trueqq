const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/auth');

// @route   GET /api/notifications
// @desc    Obtener notificaciones del usuario
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { unreadOnly } = req.query;
    
    let filters = { user: req.user._id };
    
    if (unreadOnly === 'true') {
      filters.read = false;
    }

    const notifications = await Notification.find(filters)
      .populate('relatedService', 'title')
      .populate('relatedTransaction', 'serviceTitle trueqqAmount')
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user._id,
      read: false
    });

    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener notificaciones',
      error: error.message
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Marcar notificación como leída
// @access  Private
router.put('/:id/read', protect, async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    if (notification.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar esta notificación'
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification
    });
  } catch (error) {
    console.error('Error al marcar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificación',
      error: error.message
    });
  }
});

// @route   PUT /api/notifications/mark-all-read
// @desc    Marcar todas las notificaciones como leídas
// @access  Private
router.put('/mark-all-read', protect, async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: 'Todas las notificaciones marcadas como leídas'
    });
  } catch (error) {
    console.error('Error al marcar todas como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al marcar notificaciones',
      error: error.message
    });
  }
});

async function createNotification(data) {
  try {
    await Notification.create(data);
  } catch (error) {
    console.error('Error al crear notificación:', error);
  }
}

module.exports = router;
module.exports.createNotification = createNotification;