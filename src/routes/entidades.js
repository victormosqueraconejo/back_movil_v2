import express from 'express';
import Entidad from './models/entidades.js';

const router = express.Router();

// Crear entidad
router.post('/entidades', async (req, res) => {
  try {
    const created = await Entidad.create(req.body);
    res.status(201).json({ ok: true, entidad: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Listar entidades
router.get('/entidades', async (req, res) => {
  try {
    const list = await Entidad.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, entidades: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/entidades/:id', async (req, res) => {
  try {
    const doc = await Entidad.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, entidad: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/entidades/:id', async (req, res) => {
  try {
    const updated = await Entidad.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, entidad: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/entidades/:id', async (req, res) => {
  try {
    const deleted = await Entidad.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
