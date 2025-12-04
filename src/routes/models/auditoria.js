import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema de Auditoría
const AuditoriaSchema = new Schema({
  // Colección y Documento afectados
  coleccion: { type: String, required: true },
  documento_id: { type: String, required: true },
  
  // Tipo de operación
  accion: { 
    type: String, 
    enum: ['CREATE', 'UPDATE', 'DELETE'], 
    required: true 
  },
  
  // Contenido del cambio (estado anterior/diferencial)
  cambios: { type: Schema.Types.Mixed, required: true },
  
  // Quién realizó la acción
  usuario_id: { type: String, ref: 'Usuario', required: true },
  
  // Fecha del registro
  fecha: { type: Date, default: Date.now }
}, { collection: 'auditoria' });

// Índices
AuditoriaSchema.index({ coleccion: 1, documento_id: 1 });
AuditoriaSchema.index({ usuario_id: 1, fecha: -1 });

export default mongoose.model('Auditoria', AuditoriaSchema);
