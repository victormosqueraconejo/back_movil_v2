import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Caracterizacion from './models/caracterizaciones.js';
import { authMiddleware } from '../middlewares/auth.js';

const router = express.Router();

// Crear o actualizar caracterización
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

    // Buscar si ya existe una caracterización con el mismo documento, tipo_documento y evento_id
    const existente = await Caracterizacion.findOne({
      'ciudadano.documento': ciudadano.documento,
      'ciudadano.tipo_documento': ciudadano.tipo_documento,
      evento_id: evento_id
    });

    let caracterizacion;
    let esActualizacion = false;

    if (existente) {
      // Si existe, actualizar la caracterización existente
      esActualizacion = true;
      const updateData = {
        ...req.body,
        _id: existente._id, // Mantener el mismo _id
        asesor_id: req.body.asesor_id || req.user?._id || existente.asesor_id,
        estado: req.body.estado || 'ACTIVO', // Asegurar que esté activa
        modificado_en: new Date()
      };
      
      caracterizacion = await Caracterizacion.findByIdAndUpdate(
        existente._id,
        updateData,
        { new: true }
      );
    } else {
      // Si no existe, crear nueva caracterización
      // Primero, desactivar todas las caracterizaciones anteriores del mismo documento
      await Caracterizacion.updateMany(
        {
          'ciudadano.documento': ciudadano.documento,
          'ciudadano.tipo_documento': ciudadano.tipo_documento,
          estado: 'ACTIVO'
        },
        {
          $set: { 
            estado: 'INACTIVO',
            modificado_en: new Date()
          }
        }
      );

      // Crear la nueva caracterización como ACTIVA
      const data = {
        _id: req.body._id || uuidv4(),
        ...req.body,
        asesor_id: req.body.asesor_id || req.user?._id,
        estado: 'ACTIVO' // Asegurar que la nueva esté activa
      };
      
      caracterizacion = await Caracterizacion.create(data);
    }

    res.status(esActualizacion ? 200 : 201).json({ 
      ok: true, 
      caracterizacion,
      accion: esActualizacion ? 'actualizada' : 'creada'
    });
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

// Buscar por nombre y apellido (busca en primer y segundo nombre/apellido, o nombre completo)
router.get('/caracterizaciones/buscar', authMiddleware, async (req, res) => {
  try {
    const { nombres, apellidos, nombre_completo } = req.query;

    if (!nombres && !apellidos && !nombre_completo) {
      return res.status(400).json({ 
        ok: false, 
        message: 'Debe proporcionar al menos uno de los parámetros: nombres, apellidos o nombre_completo' 
      });
    }

    let query = {};
    
    // Búsqueda por nombre completo (busca en la concatenación de nombres + apellidos)
    if (nombre_completo) {
      const nombreCompletoBusqueda = nombre_completo.trim();
      const nombreCompletoEscapado = nombreCompletoBusqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      
      // Buscar en la concatenación de nombres y apellidos usando $expr
      query.$expr = {
        $regexMatch: {
          input: { $concat: ['$ciudadano.nombres', ' ', '$ciudadano.apellidos'] },
          regex: nombreCompletoEscapado,
          options: 'i'
        }
      };
    } else {
      // Búsqueda por nombres (busca en primer nombre y segundo nombre)
      // Busca el texto en cualquier parte del campo nombres (case insensitive)
      if (nombres) {
        const nombreBusqueda = nombres.trim();
        // Escapar caracteres especiales de regex
        const nombreEscapado = nombreBusqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query['ciudadano.nombres'] = { 
          $regex: new RegExp(nombreEscapado, 'i') 
        };
      }

      // Búsqueda por apellidos (busca en primer apellido y segundo apellido)
      // Busca el texto en cualquier parte del campo apellidos (case insensitive)
      if (apellidos) {
        const apellidoBusqueda = apellidos.trim();
        // Escapar caracteres especiales de regex
        const apellidoEscapado = apellidoBusqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        query['ciudadano.apellidos'] = { 
          $regex: new RegExp(apellidoEscapado, 'i') 
        };
      }
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

// Buscar caracterizaciones por nacionalidad
router.get('/caracterizaciones/nacionalidad/:nacionalidad', authMiddleware, async (req, res) => {
  try {
    const { nacionalidad } = req.params;
    const { estado } = req.query; // Opcional: filtrar por estado (ACTIVO/INACTIVO)

    let query = {
      'identidad.nacionalidad': { 
        $regex: new RegExp(nacionalidad.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i') 
      }
    };

    if (estado) {
      query.estado = estado;
    }

    const caracterizaciones = await Caracterizacion.find(query).sort({ fecha_creacion: -1 });
    
    if (caracterizaciones.length === 0) {
      return res.status(404).json({ ok: false, message: 'No se encontraron caracterizaciones con esta nacionalidad' });
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
