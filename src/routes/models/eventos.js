import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema base de sincronización
const base_sync = {
  modificado_en: { type: Date, default: Date.now },
  sincronizado: { type: Boolean, default: false }
};

// Esquema de Evento
const EventoSchema = new Schema({
  // UUID del móvil
  _id: { type: String, required: true },
  
  // Nombre legible del evento
  nombre: { type: String, required: true },
  
  // Ubicación
  ciudad: { type: String, required: true },
  departamento: { type: String, required: true },
  lugar_caracterizacion: { type: String },
  
  // Periodo de validez del evento
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  
  // Define si el evento permite o no nuevos registros
  estado: { 
    type: String, 
    enum: ['ACTIVO', 'CERRADO'], 
    default: 'ACTIVO' 
  },
  
  // Asesores autorizados para descargar y usar este evento
  asesores_asignados: [{ type: String, ref: 'Usuario' }],
  
  ...base_sync
}, { 
  _id: false,
  timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }, 
  collection: 'eventos' 
});

// Índices
EventoSchema.index({ fecha_inicio: 1, fecha_fin: 1 });
EventoSchema.index({ estado: 1 });
EventoSchema.index({ ciudad: 1, departamento: 1 });

export default mongoose.model('Evento', EventoSchema);
