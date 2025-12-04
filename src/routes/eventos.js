import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Evento from './models/eventos.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Crear evento
router.post('/eventos', authMiddleware, async (req, res) => {
  try {
    const { nombre, ciudad, departamento, fecha_inicio, fecha_fin } = req.body;

    // Validar campos requeridos
    if (!nombre || !ciudad || !departamento || !fecha_inicio || !fecha_fin) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Campos requeridos: nombre, ciudad, departamento, fecha_inicio, fecha_fin' 
      });
    }

    const data = {
      _id: req.body._id || uuidv4(),
      ...req.body
    };
    const created = await Evento.create(data);
    res.status(201).json({ ok: true, evento: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Listar eventos
router.get('/eventos', authMiddleware, async (req, res) => {
  try {
    const list = await Evento.find().sort({ fecha_creacion: -1 });
    res.json({ ok: true, eventos: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/eventos/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Evento.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, evento: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/eventos/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Evento.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, modificado_en: new Date() }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, evento: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/eventos/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Evento.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
