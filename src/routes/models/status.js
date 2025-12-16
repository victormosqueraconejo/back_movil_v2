import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema base de sincronización
const base_sync = {
  modificado_en: { type: Date, default: Date.now },
  sincronizado: { type: Boolean, default: false }
};

// Esquema de Status
const StatusSchema = new Schema({
  // UUID del móvil
  _id: { type: String, required: true },
  
  // Mensaje o descripción del estado
  mensaje: { type: String },
  
  // Estado del sistema
  estado: { type: String, default: 'ACTIVO' },
  
  // Datos adicionales (flexible)
  datos: { type: Schema.Types.Mixed },
  
  ...base_sync
}, { 
  _id: false,
  timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }, 
  collection: 'status' 
});

// Índices
StatusSchema.index({ estado: 1 });

export default mongoose.model('Status', StatusSchema);

