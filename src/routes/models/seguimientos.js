import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema base de sincronización
const base_sync = {
  modificado_en: { type: Date, default: Date.now },
  sincronizado: { type: Boolean, default: false }
};

// Esquema de Seguimiento
const SeguimientoSchema = new Schema({
  // UUID del móvil
  _id: { type: String, required: true },
  
  // Vínculo con el registro de Caracterización
  caracterizacion_id: { type: String, ref: 'Caracterizacion', required: true },
  
  // Momento en que se registra el seguimiento
  fecha_seguimiento: { type: Date, default: Date.now, required: true },
  
  // Acción realizada (campo explícito)
  accion_realizada: { type: String, required: true },

  // Gestión realizada ante (ej. entidad o área)
  gestion_ante: { type: String, required: true },

  // Detalle de la acción (opcional)
  descripcion: { type: String },

  // Tipo de consulta (clasificación)
  tipo_consulta: { type: String, required: true },
  
  ...base_sync
}, { 
  _id: false,
  timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }, 
  collection: 'seguimientos' 
});

// Índices
SeguimientoSchema.index({ caracterizacion_id: 1 });

export default mongoose.model('Seguimiento', SeguimientoSchema);
