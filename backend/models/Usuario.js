const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  correo: {
    type: String,
    required: [true, 'El correo es requerido'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Correo inválido']
  },
  contraseña: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
    select: false
  },
  esAdministrador: {
    type: Boolean,
    default: false
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  ultimoAcceso: Date,
  activo: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Hash contraseña antes de guardar
usuarioSchema.pre('save', async function (next) {
  if (!this.isModified('contraseña')) return next();
  this.contraseña = await bcrypt.hash(this.contraseña, 12);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContraseña = async function (contraseñaCandidata) {
  return await bcrypt.compare(contraseñaCandidata, this.contraseña);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
