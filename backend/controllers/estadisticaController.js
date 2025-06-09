const Estadistica = require('../models/Estadistica');

// Crear estadística
exports.crearEstadistica = async (req, res) => {
  try {
    const estadistica = new Estadistica(req.body);
    await estadistica.save();
    res.status(201).json(estadistica);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al crear estadística' });
  }
};

// Listar estadísticas
exports.listarEstadisticas = async (req, res) => {
  try {
    const estadisticas = await Estadistica.find();
    res.json(estadisticas);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
  }
};

// Obtener estadística por fecha
exports.obtenerPorFecha = async (req, res) => {
  try {
    const { fecha } = req.params;
    const estadistica = await Estadistica.findOne({ fecha });
    if (!estadistica) return res.status(404).json({ mensaje: 'No hay estadística para esa fecha' });
    res.json(estadistica);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al buscar estadística' });
  }
};
