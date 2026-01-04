import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Caracterizacion from './models/caracterizaciones.js';

const router = express.Router();

router.post('/caracterizaciones', async (req, res) => {
  try {
    const { ciudadano, evento_id, asesor_id } = req.body;

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
      ...req.body
    };
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
    const list = await Caracterizacion.find().sort({ fecha_creacion: -1 });
    res.json({ ok: true, caracterizaciones: list });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por evento_id (debe ir antes de /:id para evitar conflictos)
router.get('/caracterizaciones/evento/:evento_id', async (req, res) => {
  try {
    const { evento_id } = req.params;
    
    if (!evento_id) {
      return res.status(400).json({ ok: false, message: 'evento_id es requerido' });
    }

    const caracterizaciones = await Caracterizacion.find({ evento_id })
      .sort({ fecha_creacion: -1 });
    
    res.json({ 
      ok: true, 
      caracterizaciones,
      total: caracterizaciones.length 
    });
  } catch (error) {
    console.error('Error buscando caracterizaciones por evento:', error);
    res.status(500).json({ ok: false, error: error.message });
  }
});

// Obtener por documento (y opcional tipo_documento). Colocar antes de /:id para evitar conflictos.
router.get('/caracterizaciones/documento/:documento', async (req, res) => {
  try {
    const { documento } = req.params;
    const { tipo_documento } = req.query;

    if (!documento) {
      return res.status(400).json({ ok: false, message: 'documento es requerido' });
    }

    const filter = { 'ciudadano.documento': documento };
    if (tipo_documento) {
      filter['ciudadano.tipo_documento'] = tipo_documento;
    }

    const caracterizaciones = await Caracterizacion.find(filter).sort({ fecha_creacion: -1 });

    if (!caracterizaciones || caracterizaciones.length === 0) {
      return res.json({
        ok: true,
        caracterizaciones: [],
        total: 0,
        message: 'No se encontraron caracterizaciones para este documento'
      });
    }

    res.json({
      ok: true,
      caracterizaciones,
      total: caracterizaciones.length
    });
  } catch (error) {
    console.error('Error buscando caracterizaciones por documento:', error);
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
    const { id } = req.params;
    
    // Verificar que la caracterización existe
    const existing = await Caracterizacion.findById(id);
    if (!existing) {
      return res.status(404).json({ ok: false, message: 'Caracterización no encontrada' });
    }

    // Preparar datos para actualización
    const updateData = { ...req.body };
    
    // No permitir actualizar el _id
    if (updateData._id && updateData._id !== id) {
      delete updateData._id;
    }
    
    // Actualizar campos de sincronización
    updateData.modificado_en = new Date();
    updateData.sincronizado = false; // Marcar como no sincronizado al modificar

    // Validar campos requeridos si se están actualizando
    if (updateData.ciudadano) {
      if (updateData.ciudadano.documento === undefined || updateData.ciudadano.tipo_documento === undefined) {
        return res.status(400).json({ 
          ok: false, 
          message: 'Si actualiza ciudadano, debe incluir documento y tipo_documento' 
        });
      }
    }

    // Validar estado si se está actualizando
    if (updateData.estado && !['ACTIVO', 'INACTIVO', 'CERRADO'].includes(updateData.estado)) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Estado debe ser ACTIVO, INACTIVO o CERRADO' 
      });
    }

    // Actualizar la caracterización
    const updated = await Caracterizacion.findByIdAndUpdate(
      id, 
      updateData, 
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: 'No se pudo actualizar la caracterización' });
    }

    res.json({ ok: true, caracterizacion: updated });
  } catch (error) {
    console.error('Error actualizando caracterización:', error);
    
    // Manejar errores de validación de Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        ok: false, 
        error: 'Error de validación', 
        details: error.message 
      });
    }
    
    // Manejar errores de duplicado
    if (error.code === 11000) {
      return res.status(400).json({ 
        ok: false, 
        error: 'Ya existe una caracterización con estos datos para este evento' 
      });
    }

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
