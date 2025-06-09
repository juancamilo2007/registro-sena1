const mongoose = require('mongoose');

const movimientoEquipoSchema = new mongoose.Schema({
  equipo: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipo', required: true },
  tipoMovimiento: { type: String, enum: ['entrada', 'salida'], required: true },
  fecha: { type: String, required: true },
  hora: { type: String, required: true },
  guardia: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
}, {
  timestamps: true
});

module.exports = mongoose.model('MovimientoEquipo', movimientoEquipoSchema);
