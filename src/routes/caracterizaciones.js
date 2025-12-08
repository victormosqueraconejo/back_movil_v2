import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Caracterizacion from './models/caracterizaciones.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Crear caracterización
router.post('/caracterizaciones', authMiddleware, async (req, res) => {
  try {
    const { ciudadano, evento_id, asesor_id } = req.body;

    // Validar campos requeridos
    if (!ciudadano || !ciudadano.documento || !ciudadano.tipo_documento) {
      return res.status(400).json({ ok: false, message: 'Campos requeridos: ciudadano.documento, ciudadano.tipo_documento' });
    }
    if (!evento_id) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: evento_id' });
    }
    if (!asesor_id) {
      return res.status(400).json({ ok: false, message: 'Campo requerido: asesor_id' });
    }

    const data = {
      _id: req.body._id || uuidv4(),
      ...req.body,
      // Si viene token, podemos guardar el asesor desde el usuario autenticado como respaldo
      asesor_id: req.body.asesor_id || req.user?._id
    };
    const created = await Caracterizacion.create(data);
    res.status(201).json({ ok: true, caracterizacion: created });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener todas
router.get('/caracterizaciones', authMiddleware, async (req, res) => {
  try {
    const list = await Caracterizacion.find().sort({ fecha_creacion: -1 });
    res.json({ ok: true, caracterizaciones: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Buscar por número de documento
router.get('/caracterizaciones/documento/:documento', authMiddleware, async (req, res) => {
  try {
    const { documento } = req.params;
    const { tipo_documento } = req.query; // Opcional: filtrar por tipo de documento

    let query = { 'ciudadano.documento': documento };
    if (tipo_documento) {
      query['ciudadano.tipo_documento'] = tipo_documento;
    }

    const caracterizaciones = await Caracterizacion.find(query).sort({ fecha_creacion: -1 });
    
    if (caracterizaciones.length === 0) {
      return res.status(404).json({ ok: false, message: 'No se encontraron caracterizaciones para este documento' });
    }

    res.json({ ok: true, caracterizaciones });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Buscar por primer nombre y primer apellido
router.get('/caracterizaciones/buscar', authMiddleware, async (req, res) => {
  try {
    const { nombres, apellidos } = req.query;

    if (!nombres && !apellidos) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Debe proporcionar al menos uno de los parámetros: nombres o apellidos' 
      });
    }

    let query = {};
    
    // Búsqueda por primer nombre (case insensitive, búsqueda parcial)
    if (nombres) {
      // Extraer el primer nombre (antes del primer espacio)
      const primerNombre = nombres.trim().split(' ')[0];
      query['ciudadano.nombres'] = { 
        $regex: new RegExp(`^${primerNombre}`, 'i') 
      };
    }

    // Búsqueda por primer apellido (case insensitive, búsqueda parcial)
    if (apellidos) {
      // Extraer el primer apellido (antes del primer espacio)
      const primerApellido = apellidos.trim().split(' ')[0];
      query['ciudadano.apellidos'] = { 
        $regex: new RegExp(`^${primerApellido}`, 'i') 
      };
    }

    const caracterizaciones = await Caracterizacion.find(query).sort({ fecha_creacion: -1 });
    
    if (caracterizaciones.length === 0) {
      return res.status(404).json({ ok: false, message: 'No se encontraron caracterizaciones con los criterios de búsqueda' });
    }

    res.json({ ok: true, caracterizaciones, total: caracterizaciones.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Buscar caracterizaciones por evento_id
router.get('/caracterizaciones/evento/:evento_id', authMiddleware, async (req, res) => {
  try {
    const { evento_id } = req.params;
    const { estado } = req.query; // Opcional: filtrar por estado (ACTIVO/INACTIVO)

    let query = { evento_id };
    if (estado) {
      query.estado = estado;
    }

    const caracterizaciones = await Caracterizacion.find(query).sort({ fecha_creacion: -1 });
    
    if (caracterizaciones.length === 0) {
      return res.status(404).json({ ok: false, message: 'No se encontraron caracterizaciones para este evento' });
    }

    res.json({ ok: true, caracterizaciones, total: caracterizaciones.length });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por id
router.get('/caracterizaciones/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Caracterizacion.findById(req.params.id);
    if (!doc) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, caracterizacion: doc });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Actualizar
router.put('/caracterizaciones/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Caracterizacion.findByIdAndUpdate(
      req.params.id, 
      { ...req.body, modificado_en: new Date() }, 
      { new: true }
    );
    if (!updated) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, caracterizacion: updated });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Eliminar
router.delete('/caracterizaciones/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await Caracterizacion.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ ok: false, message: 'No encontrado' });
    res.json({ ok: true, message: 'Eliminado' });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

export default router;
