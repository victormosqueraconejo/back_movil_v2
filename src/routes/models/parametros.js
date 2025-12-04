import mongoose from 'mongoose';

const { Schema } = mongoose;

// Esquema de Parámetro
const ParametroSchema = new Schema({
  // Tipo de catálogo (ej: TIPO_DOCUMENTO, PAIS)
  tipo: { type: String, required: true, index: true },
  
  // Valor corto que se guarda en Caracterización
  codigo: { type: String, required: true },
  
  // Valor visible para el Asesor
  nombre: { type: String, required: true },
  
  // Usado para relaciones jerárquicas (ej: Ciudades filtradas por Departamento)
  padre_codigo: { type: String }
}, { collection: 'parametros' });

// Asegura que la combinación tipo + codigo sea única
ParametroSchema.index({ tipo: 1, codigo: 1 }, { unique: true });

export default mongoose.model('Parametro', ParametroSchema);
