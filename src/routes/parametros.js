import express from 'express';
import Parametro from './models/parametros.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Crear parámetro
router.post('/parametros', authMiddleware, async (req, res) => {
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

// Listar todos los parámetros
router.get('/parametros', authMiddleware, async (req, res) => {
  try {
    const items = await Parametro.find().limit(500);
    res.json({ ok: true, data: items });
  } catch (error) {
    console.error('Error listando parametros:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener parámetros por tipo
router.get('/parametros/tipo/:tipo', authMiddleware, async (req, res) => {
  try {
    const items = await Parametro.find({ tipo: req.params.tipo });
    res.json({ ok: true, data: items });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener parámetros por tipo y padre (jerárquico)
router.get('/parametros/tipo/:tipo/padre/:padre_codigo', authMiddleware, async (req, res) => {
  try {
    const items = await Parametro.find({ 
      tipo: req.params.tipo,
      padre_codigo: req.params.padre_codigo 
    });
    res.json({ ok: true, data: items });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
