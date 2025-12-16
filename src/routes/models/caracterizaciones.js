import mongoose from 'mongoose';

const { Schema } = mongoose;

const base_sync = {
  modificado_en: { type: Date, default: Date.now },
  sincronizado: { type: Boolean, default: false }
};

const entidad_data_schema = new Schema({
  nombre: { type: String, required: true },
  tipo: { type: String, required: true },
  contacto: { type: String }
}, { _id: false });

// Remisión con entidad denormalizada
const remision_schema = new Schema({
  fecha_remision: { type: Date, default: Date.now },
  prioridad: { type: String },
  // Ahora puede recibir múltiples entidades
  entidad_data: { type: [entidad_data_schema], required: true }
}, { _id: false });

const CaracterizacionSchema = new Schema({
  // UUID del móvil
  _id: { type: String, required: true },
  
  // Datos principales del ciudadano para búsqueda rápida
  ciudadano: {
    documento: { type: String, required: true, index: true },
    tipo_documento: { type: String, required: true },
    nombres: { type: String },
    apellidos: { type: String }
  },
  
  // Vínculos
  evento_id: { type: String, ref: 'Evento', required: true },
  asesor_id: { type: String, ref: 'Usuario', required: true },
  
  // Estado de la caracterización
  estado: { 
    type: String, 
    enum: ['ACTIVO', 'INACTIVO'], 
    default: 'ACTIVO',
    index: true
  },
  
  // Secciones del formulario (Mixed para flexibilidad)
  identidad: { type: Schema.Types.Mixed },
  salud: { type: Schema.Types.Mixed },
  formacion: { type: Schema.Types.Mixed },
  
  // Gestión y Remisiones
  gestion: {
    remisiones: [remision_schema]
  },
  
  // URL del documento RUR (opcional)
  rur_document_url: { type: String, default: null },
  
  ...base_sync
}, { 
  _id: false,
  timestamps: { createdAt: 'fecha_creacion', updatedAt: 'fecha_actualizacion' }, 
  collection: 'caracterizaciones' 
});

// Índice único para evitar duplicados
CaracterizacionSchema.index({ 'ciudadano.tipo_documento': 1, 'ciudadano.documento': 1, evento_id: 1 }, { unique: true });

export default mongoose.model('Caracterizacion', CaracterizacionSchema);
