import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const registroSchema = new Schema({
  fecha: { type: Date, default: Date.now },
  accion: String,
  gestion_ante: String,
  tipo_consulta: String,
  registrado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { _id: false });

const SeguimientoSchema = new Schema({
  caracterizacion_id: { type: Schema.Types.ObjectId, ref: 'Caracterizacion', required: true },
  registros: { type: [registroSchema], default: [] },
  estado: { type: String, enum: ['ABIERTO', 'CERRADO'], default: 'ABIERTO' },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'seguimientos' });

SeguimientoSchema.index({ caracterizacionId: 1 });
SeguimientoSchema.index({ estado: 1 });

export default mongoose.model('Seguimiento', SeguimientoSchema);
