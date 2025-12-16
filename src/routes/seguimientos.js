import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Seguimiento from './models/seguimientos.js';
import Caracterizacion from './models/caracterizaciones.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Crear seguimiento
router.post('/seguimientos', authMiddleware, async (req, res) => {
  try {
    const { caracterizacion_id, accion_realizada, gestion_ante, tipo_consulta } = req.body;

    // Validar campos requeridos
    if (!caracterizacion_id) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: caracterizacion_id' });
    }
    if (!accion_realizada) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: accion_realizada' });
    }
    if (!gestion_ante || !Array.isArray(gestion_ante) || gestion_ante.length === 0) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: gestion_ante (array de strings)' });
    }
    if (!tipo_consulta) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: tipo_consulta' });
    }

    const data = {
      _id: req.body._id || uuidv4(),
      ...req.body,
      usuario_id: req.body.usuario_id || req.user?._id
    };
    const created = await Seguimiento.create(data);
    res.status(201).json({ ok: true, seguimiento: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener todos
router.get('/seguimientos', authMiddleware, async (req, res) => {
  try {
    const list = await Seguimiento.find().sort({ fecha_creacion: -1 });
    res.json({ ok: true, seguimientos: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por caracterización
router.get('/seguimientos/caracterizacion/:caracterizacion_id', authMiddleware, async (req, res) => {
  try {
    const list = await Seguimiento.find({ caracterizacion_id: req.params.caracterizacion_id })
      .sort({ fecha_seguimiento: -1 });
    res.json({ ok: true, seguimientos: list });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por número de documento (debe ir antes de /:id para evitar conflictos)
router.get('/seguimientos/documento/:documento', authMiddleware, async (req, res) => {
  try {
    const { documento } = req.params;
    
    if (!documento) {
      return res.status(400).json({ ok: false, message: 'Número de documento es requerido' });
    }

    // Buscar todas las caracterizaciones con ese número de documento
    const caracterizaciones = await Caracterizacion.find({ 
      'ciudadano.documento': documento 
    }).select('_id');

    if (!caracterizaciones || caracterizaciones.length === 0) {
      return res.json({ 
        ok: true, 
        seguimientos: [],
        total: 0,
        message: 'No se encontraron caracterizaciones para este documento' 
      });
    }

    // Obtener los IDs de las caracterizaciones
    const caracterizacionIds = caracterizaciones.map(c => c._id);

    // Buscar todos los seguimientos asociados a esas caracterizaciones
    const seguimientos = await Seguimiento.find({ 
      caracterizacion_id: { $in: caracterizacionIds } 
    })
      .sort({ fecha_seguimiento: -1 });

    res.json({ 
      ok: true, 
      seguimientos,
      total: seguimientos.length,
      documento: documento
    });
  } catch (error) {
    console.error('Error buscando seguimientos por documento:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/seguimientos/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Seguimiento.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, seguimiento: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/seguimientos/:id', authMiddleware, async (req, res) => {
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
router.delete('/seguimientos/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Seguimiento.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
