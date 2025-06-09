const SesionGuardia = require('../models/SesionGuardia');

// Crear sesión de guardia
exports.crearSesion = async (req, res) => {
  try {
    const sesion = new SesionGuardia(req.body);
    await sesion.save();
    res.status(201).json(sesion);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear sesión de guardia' });
  }
};

// Listar sesiones de guardias
exports.listarSesiones = async (req, res) => {
  try {
    const sesiones = await SesionGuardia.find().populate('guardia equiposRegistrados');
    res.json(sesiones);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener sesiones' });
  }
};

// Cerrar sesión de guardia
exports.cerrarSesion = async (req, res) => {
  try {
    const { id } = req.params;
    const { fechaSalida, horaSalida } = req.body;
    const sesion = await SesionGuardia.findByIdAndUpdate(id, { fechaSalida, horaSalida }, { new: true });
    if (!sesion) return res.status(404).json({ mensaje: 'Sesión no encontrada' });
    res.json(sesion);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al cerrar sesión' });
  }
};
