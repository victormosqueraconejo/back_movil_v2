import express from 'express';
import Auditoria from './models/auditoria.js';

const router = express.Router();

// Crear un registro de auditoría
router.post('/auditoria', async (req, res) => {
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
router.get('/auditoria', async (req, res) => {
  try {
    const items = await Auditoria.find().sort({ fecha: -1 }).limit(200);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando auditorias:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener auditoría por documento
router.get('/auditoria/documento/:documento_id', async (req, res) => {
  try {
    const items = await Auditoria.find({ documento_id: req.params.documento_id })
      .sort({ fecha: -1 });
    res.json({ ok: true, data: items });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
