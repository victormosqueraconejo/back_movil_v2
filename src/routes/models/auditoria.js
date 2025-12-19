import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema de Auditoría
const AuditoriaSchema = new Schema({
  // Tipo de error
  tipoError: { type: String, required: true },
  
  // ID de la caracterización relacionada
  caracterizacionId: { type: String, ref: 'Caracterizacion' },
  
  // Datos del documento
  tipoDocumento: { type: String },
  numeroDocumento: { type: String, index: true },
  
  // Información del usuario
  usuarioId: { type: String, ref: 'Usuario', required: true, index: true },
  rolUsuario: { type: String },
  
  // Información de conexión
  modoConexion: { 
    type: String, 
    enum: ['ONLINE', 'OFFLINE'],
    required: true 
  },
  origenDatos: { 
    type: String, 
    enum: ['BD_LOCAL', 'BD_CENTRAL', 'API'],
    required: true 
  },
  
  // Estado de sincronización
  estadoSincronizacion: { 
    type: String, 
    enum: ['EXITOSA', 'FALLIDA', 'PENDIENTE'],
    required: true 
  },
  
  // Intentos de sincronización
  intentosSincronizacion: { type: Number, default: 0 },
  
  // Mensaje de error
  mensajeError: { type: String },
  
  // Fecha del evento
  fechaEvento: { type: Date, default: Date.now, required: true, index: true }
}, { collection: 'auditoria' });

// Índices
AuditoriaSchema.index({ caracterizacionId: 1 });
AuditoriaSchema.index({ usuarioId: 1, fechaEvento: -1 });
AuditoriaSchema.index({ estadoSincronizacion: 1 });
AuditoriaSchema.index({ tipoError: 1 });

export default mongoose.model('Auditoria', AuditoriaSchema);

