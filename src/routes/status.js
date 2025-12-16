import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Status from './models/status.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Obtener status (sin autenticación)
router.get('/status', async (req, res) => {
  try {
    const status = await Status.find().sort({ fecha_creacion: -1 }).limit(1);
    
    if (!status || status.length === 0) {
      return res.json({ 
        ok: true, 
        status: {
          estado: 'ACTIVO',
          mensaje: 'Sistema operativo',
          fecha: new Date()
        }
      });
    }
    
    res.json({ ok: true, status: status[0] });
  } catch (error) {
    console.error('Error obteniendo status:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Crear status (con autenticación)
router.post('/status', authMiddleware, async (req, res) => {
  try {
    const data = {
      _id: req.body._id || uuidv4(),
      ...req.body
    };
    
    const created = await Status.create(data);
    res.status(201).json({ ok: true, status: created });
  } catch (error) {
    console.error('Error creando status:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar status (con autenticación)
router.put('/status/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar que el status existe
    const existing = await Status.findById(id);
    if (!existing) {
      return res.status(404).json({ ok: false, message: 'Status no encontrado' });
    }

    // Preparar datos para actualización
    const updateData = { ...req.body };
    
    // No permitir actualizar el _id
    if (updateData._id && updateData._id !== id) {
      delete updateData._id;
    }
    
    // Actualizar campos de sincronización
    updateData.modificado_en = new Date();
    updateData.sincronizado = false;

    // Actualizar el status
    const updated = await Status.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: 'No se pudo actualizar el status' });
    }

    res.json({ ok: true, status: updated });
  } catch (error) {
    console.error('Error actualizando status:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Error de validación', 
        details: error.message 
      });
    }

    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;

