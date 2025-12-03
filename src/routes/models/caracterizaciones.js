import mongoose from 'mongoose';

const { Schema } = mongoose;

const baseSync = {
  creado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  actualizado_por: { type: Schema.Types.ObjectId, ref: 'Usuario' },
  deleted: { type: Boolean, default: false },
  version: { type: Number, default: 1 }
};

const tiempoPermanenciaSchema = new Schema({ anios: Number, meses: Number, dias: Number }, { _id: false });

const otraNacionalidadSchema = new Schema({ pais: String, pasaporte: String }, { _id: false });

const remisionSchema = new Schema({ entidadId: { type: Schema.Types.ObjectId, ref: 'Entidad' }, nombreEntidadSnapshot: String, prioridad: String, fechaRemision: Date, estado: { type: String, default: 'PENDIENTE' } }, { _id: false });

const CaracterizacionSchema = new Schema({
  evento_id: { type: Schema.Types.ObjectId, ref: 'Evento', required: true },
  asesor_id: { type: Schema.Types.ObjectId, ref: 'Usuario', required: true },
  ciudadano: {
    tipo_documento: { type: String, required: true },
    numero_documento: { type: String, required: true },
    nombres: String,
    apellidos: String,
    fecha_nacimiento: Date,
    genero: String,
    telefono: String,
    email: String,
    tiene_correo: Boolean
  },
  identidad: {
    auto_reconoce: String,
    es_victima_conflicto: Boolean,
    otras_nacionalidades: { type: [otraNacionalidadSchema], default: [] }
  },
  formacion: { nivel_estudio: String, area_conocimiento: String },
  migracion: {
    con_quien_migro: String,
    razon_migracion: String,
    actividad_antes: String,
    actividad_otra: String,
    ciudad_destino: String,
    departamento_destino: String,
    direccion_colombia: String,
    motivo_retorno: String,
    fecha_ingreso_pais: Date,
    pais_procedencia: String,
    tiempo_permanencia: tiempoPermanenciaSchema,
    riesgo_trayecto: { hubo_riesgo: Boolean, descripcion: String }
  },
  redes_apoyo: {
    retorna_con_nucleo: Boolean,
    composicion_familiar: [String],
    hijos_en_colombia: Boolean,
    hijos_estudian: Boolean,
    programa_estatal: { es_beneficiario: Boolean, nombre: String },
    apoyo_familiar: { tiene_apoyo: Boolean, quien: String, relacion: String, contacto: String }
  },
  salud: {
    accidente: { hubo_accidente: Boolean, descripcion: String },
    discapacidad: { tiene: Boolean, tipo: String },
    afiliado_salud: Boolean
  },
  gestion: {
    registrado_RUR: Boolean,
    tipo_Retorno: String,
    necesidad_proteccion: { tiene: Boolean, condicion: String },
    motivo_remision: String,
    remision_hecha_por: String,
    remisiones: { type: [remisionSchema], default: [] },
    observaciones: String
  },
  metadataSync: { creado_offline: { type: Boolean, default: false }, ultima_sincronizacion: Date, dispositivoId: String },
  ...baseSync
}, { timestamps: { createdAt: 'fechaCreacion', updatedAt: 'fechaActualizacion' }, collection: 'caracterizaciones' });

CaracterizacionSchema.index({ 'ciudadano.tipoDocumento': 1, 'ciudadano.numeroDocumento': 1, eventoId: 1 }, { unique: true });

export default mongoose.model('Caracterizacion', CaracterizacionSchema);
