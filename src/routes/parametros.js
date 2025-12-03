import express from 'express';
import Parametro from './models/parametros.js';

const router = express.Router();

router.post('/parametros', async (req, res) => {
  try {
    const payload = req.body;
    const nuevo = new Parametro(payload);
    const saved = await nuevo.save();
    res.status(201).json({ ok: true, data: saved });
  } catch (error) {
    console.error('Error creando parametro:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

router.get('/parametros', async (req, res) => {
  try {
    const items = await Parametro.find().limit(500);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando parametros:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
