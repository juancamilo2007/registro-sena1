const mongoose = require('mongoose');

const sesionGuardiaSchema = new mongoose.Schema({
  guardia: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true },
  fechaIngreso: { type: String, required: true },
  horaIngreso: { type: String, required: true },
  fechaSalida: { type: String },
  horaSalida: { type: String },
  equiposRegistrados: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Equipo' }],
}, {
  timestamps: true
});

module.exports = mongoose.model('SesionGuardia', sesionGuardiaSchema);
