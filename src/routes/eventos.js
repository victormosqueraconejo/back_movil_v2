import express from 'express';
import Evento from './models/eventos.js';

const router = express.Router();

// Crear evento
router.post('/eventos', async (req, res) => {
  try {
    const created = await Evento.create(req.body);
    res.status(201).json({ ok: true, evento: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Listar eventos
router.get('/eventos', async (req, res) => {
  try {
    const list = await Evento.find().sort({ fechaCreacion: -1 });
    res.json({ ok: true, eventos: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/eventos/:id', async (req, res) => {
  try {
    const doc = await Evento.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, evento: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/eventos/:id', async (req, res) => {
  try {
    const updated = await Evento.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, evento: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/eventos/:id', async (req, res) => {
  try {
    const deleted = await Evento.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
