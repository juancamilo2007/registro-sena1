const mongoose = require('mongoose');

const estadisticaSchema = new mongoose.Schema({
  fecha: { type: String, required: true },
  totalEquiposRegistrados: { type: Number, default: 0 },
  totalEquiposDevueltos: { type: Number, default: 0 },
  totalSesionesGuardias: { type: Number, default: 0 },
  detalles: { type: mongoose.Schema.Types.Mixed }, // Para guardar datos adicionales
}, {
  timestamps: true
});

module.exports = mongoose.model('Estadistica', estadisticaSchema);
