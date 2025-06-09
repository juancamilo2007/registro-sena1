const mongoose = require('mongoose')

const equipoSchema = new mongoose.Schema({
  nombreEstudiante: { type: String, required: true },
  documentoEstudiante: { type: String, required: true },
  tipoEquipo: { type: String, required: true },
  marca: { type: String, required: true },
  traeCargador: { type: Boolean, default: false },
  traeMouse: { type: Boolean, default: false },
  traeTeclado: { type: Boolean, default: false },
  fechaEntrada: { type: String, required: true },
  horaEntrada: { type: String, required: true },
  fechaSalida: { type: String },
  horaSalida: { type: String },
  guardiaRegistro: { type: String, required: true }
}, {
  timestamps: true
})

module.exports = mongoose.model('Equipo', equipoSchema)
