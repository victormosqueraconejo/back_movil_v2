import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const ParametroSchema = new Schema({
  tipo: { type: String, required: true },
  codigo: { type: String, required: true },
  nombre: { type: String, required: true },
  padre_codigo: { type: String, index: true },
  valor_adicional: { type: String },
  orden: { type: Number, default: 0 },
  estado: { type: String, default: 'ACTIVO' },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'parametros' });

ParametroSchema.index({ tipo: 1, codigo: 1 }, { unique: true });

export default mongoose.model('Parametro', ParametroSchema);
