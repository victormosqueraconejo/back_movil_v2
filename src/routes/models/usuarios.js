import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const UsuarioSchema = new Schema({
  nombre_usuario: { type: String, required: true, unique: true, index: true },
  password: { type: String, select: false },
  tipo_documento: { type: String, required: true },
  numero_documento: { type: String, required: true },
  nacionalidad: { type: String },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  correo_electronico: { type: String, required: true, index: true },
  rol: { type: String, enum: ['LIDER', 'ASESOR_CRORE', 'ADMIN'], required: true },
  lider_asignado: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  departamento: { type: String },
  ciudad: { type: String },
  estado: { type: String, enum: ['ACTIVO', 'INACTIVO'], default: 'ACTIVO' },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'usuarios' });

UsuarioSchema.index({ numeroDocumento: 1, tipoDocumento: 1 });
UsuarioSchema.index({ liderAsignado: 1 });

export default mongoose.model('Usuario', UsuarioSchema);
