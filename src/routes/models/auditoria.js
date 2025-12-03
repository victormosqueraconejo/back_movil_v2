import mongoose from 'mongoose';

const { Schema } = mongoose;

const AuditoriaSchema = new Schema({
  coleccion: { type: String, required: true },
  documento_id: { type: Schema.Types.ObjectId, required: true },
  accion: { type: String, enum: ['CREATE', 'UPDATE', 'DELETE', 'SYNC_ERROR'] },
  cambios: Schema.Types.Mixed,
  usuario_id: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  ip: String,
  user_agent: String,
  fecha: { type: Date, default: Date.now }
}, { collection: 'auditoria' });

// TTL index: borrar después de 1 año
AuditoriaSchema.index({ fecha: 1 }, { expireAfterSeconds: 31536000 });
AuditoriaSchema.index({ coleccion: 1, documentoId: 1 });
AuditoriaSchema.index({ usuarioId: 1, fecha: -1 });

export default mongoose.model('Auditoria', AuditoriaSchema);
