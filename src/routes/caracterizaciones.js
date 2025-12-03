import express from 'express';
import Caracterizacion from './models/caracterizaciones.js';

const router = express.Router();

// Crear caracterización
router.post('/caracterizaciones', async (req, res) => {
  try {
    const data = req.body;
    const created = await Caracterizacion.create(data);
    res.status(201).json({ ok: true, caracterizacion: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener todas
router.get('/caracterizaciones', async (req, res) => {
  try {
    const list = await Caracterizacion.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, caracterizaciones: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/caracterizaciones/:id', async (req, res) => {
  try {
    const doc = await Caracterizacion.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, caracterizacion: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/caracterizaciones/:id', async (req, res) => {
  try {
    const updated = await Caracterizacion.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, caracterizacion: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/caracterizaciones/:id', async (req, res) => {
  try {
    const deleted = await Caracterizacion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
