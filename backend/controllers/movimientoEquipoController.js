const MovimientoEquipo = require('../models/MovimientoEquipo');

// Registrar movimiento de equipo
exports.crearMovimiento = async (req, res) => {
  try {
    const movimiento = new MovimientoEquipo(req.body);
    await movimiento.save();
    res.status(201).json(movimiento);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar movimiento' });
  }
};

// Listar movimientos de equipos
exports.listarMovimientos = async (req, res) => {
  try {
    const movimientos = await MovimientoEquipo.find().populate('equipo guardia');
    res.json(movimientos);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener movimientos' });
  }
};
