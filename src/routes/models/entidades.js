import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creadoPor: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const EntidadSchema = new Schema({
  nombre: { type: String, required: true, unique: true },
  tipo: { type: String },
  contacto: {
    correo: { type: String },
    telefono: { type: String },
    direccion: { type: String }
  },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'entidades' });

EntidadSchema.index({ estado: 1 });
EntidadSchema.index({ tipo: 1 });

export default mongoose.model('Entidad', EntidadSchema);
