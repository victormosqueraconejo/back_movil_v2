import express from 'express';
import Auditoria from './models/auditoria.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Crear un registro de auditoría
router.post('/auditoria', authMiddleware, async (req, res) => {
  try {
    const payload = req.body;
    const nuevo = new Auditoria(payload);
    const saved = await nuevo.save();
    res.status(201).json({ ok: true, data: saved });
  } catch (error) {
    console.error('Error creando auditoria:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Listar auditorías
router.get('/auditoria', authMiddleware, async (req, res) => {
  try {
    const items = await Auditoria.find().sort({ fechaEvento: -1 }).limit(200);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando auditorias:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener auditoría por caracterización
router.get('/auditoria/caracterizacion/:caracterizacionId', authMiddleware, async (req, res) => {
  try {
    const items = await Auditoria.find({ caracterizacionId: req.params.caracterizacionId })
      .sort({ fechaEvento: -1 });
    res.json({ ok: true, data: items });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener auditoría por número de documento
router.get('/auditoria/documento/:numeroDocumento', authMiddleware, async (req, res) => {
  try {
    const items = await Auditoria.find({ numeroDocumento: req.params.numeroDocumento })
      .sort({ fechaEvento: -1 });
    res.json({ ok: true, data: items });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;

