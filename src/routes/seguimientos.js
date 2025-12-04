import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Seguimiento from './models/seguimientos.js';

const router = express.Router();

// Crear seguimiento
router.post('/seguimientos', async (req, res) => {
  try {
    const { caracterizacion_id, descripcion, resultado } = req.body;

    // Validar campos requeridos
    if (!caracterizacion_id) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: caracterizacion_id' });
    }
    if (!descripcion) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: descripcion' });
    }
    if (!resultado) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: resultado' });
    }
    if (!['EXITOSO', 'PENDIENTE', 'FALLIDO', 'CANCELADO'].includes(resultado)) {
      return res.status(400).json({ ok: false, message: 'resultado debe ser: EXITOSO, PENDIENTE, FALLIDO o CANCELADO' });
    }

    const data = {
      _id: req.body._id || uuidv4(),
      ...req.body
    };
    const created = await Seguimiento.create(data);
    res.status(201).json({ ok: true, seguimiento: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener todos
router.get('/seguimientos', async (req, res) => {
  try {
    const list = await Seguimiento.find().sort({ fecha_creacion: -1 });
    res.json({ ok: true, seguimientos: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por caracterización
router.get('/seguimientos/caracterizacion/:caracterizacion_id', async (req, res) => {
  try {
    const list = await Seguimiento.find({ caracterizacion_id: req.params.caracterizacion_id })
      .sort({ fecha_seguimiento: -1 });
    res.json({ ok: true, seguimientos: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/seguimientos/:id', async (req, res) => {
  try {
    const doc = await Seguimiento.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, seguimiento: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/seguimientos/:id', async (req, res) => {
  try {
    const updated = await Seguimiento.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, modificado_en: new Date() }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, seguimiento: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/seguimientos/:id', async (req, res) => {
  try {
    const deleted = await Seguimiento.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
