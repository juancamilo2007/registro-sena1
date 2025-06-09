const Equipo = require('../models/Equipo')

// Crear equipo
exports.crearEquipo = async (req, res) => {
  try {
    const equipo = new Equipo(req.body)
    await equipo.save()
    res.status(201).json(equipo)
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar equipo' })
  }
}

// Listar equipos
exports.listarEquipos = async (req, res) => {
  try {
    const equipos = await Equipo.find()
    res.json(equipos)
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener equipos' })
  }
}

// Obtener equipo por ID
exports.obtenerEquipoPorId = async (req, res) => {
  try {
    const equipo = await Equipo.findById(req.params.id)
    if (!equipo) return res.status(404).json({ mensaje: 'Equipo no encontrado' })
    res.json(equipo)
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener equipo' })
  }
}

// Actualizar equipo por ID (PUT)
exports.actualizarEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!equipo) return res.status(404).json({ mensaje: 'Equipo no encontrado' })
    res.json(equipo)
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar equipo' })
  }
}

// Eliminar equipo por ID (DELETE)
exports.eliminarEquipo = async (req, res) => {
  try {
    const equipo = await Equipo.findByIdAndDelete(req.params.id)
    if (!equipo) return res.status(404).json({ mensaje: 'Equipo no encontrado' })
    res.json({ mensaje: 'Equipo eliminado' })
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar equipo' })
  }
}
