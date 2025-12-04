import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema base de sincronización
const base_sync = {
  modificado_en: { type: Date, default: Date.now },
  sincronizado: { type: Boolean, default: false }
};

// Esquema de Usuario
const UsuarioSchema = new Schema({
  // Usamos String para _id para aceptar UUIDs generados en el móvil
  _id: { type: String, required: true },
  
  // Identificador de acceso
  username: { type: String, required: true, unique: true, index: true },
  // Contraseña cifrada (hash)
  password_hash: { type: String, select: false },
  
  // Documentación
  tipo_documento: { type: String, required: true },
  numero_documento: { type: String, required: true },
  nacionalidad: { type: String },
  
  // Nombre completo
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  
  // Contacto
  correo_electronico: { type: String, required: true, index: true },
  
  // Rol del funcionario
  rol: { 
    type: String, 
    enum: ['LIDER', 'ASESOR', 'ADMIN'], 
    required: true 
  },
  
  // ID del Líder supervisor (solo aplica si rol es ASESOR)
  lider_asignado: { type: String, ref: 'Usuario' },
  
  // Ubicación
  departamento: { type: String },
  ciudad: { type: String },
  
  // Estado de la cuenta
  estado: { 
    type: String, 
    enum: ['ACTIVO', 'INACTIVO'], 
    default: 'ACTIVO' 
  },
  
  ...base_sync
}, { 
  _id: false, // Usamos nuestro propio _id
  timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }, 
  collection: 'usuarios' 
});

// Índices
UsuarioSchema.index({ numero_documento: 1, tipo_documento: 1 });
UsuarioSchema.index({ lider_asignado: 1 });

export default mongoose.model('Usuario', UsuarioSchema);
