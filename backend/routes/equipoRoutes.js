const express = require('express');
const router = express.Router();
const equipoController = require('../controllers/equipoController');

// Crear equipo
router.post('/', equipoController.crearEquipo);

// Listar todos los equipos
router.get('/', equipoController.listarEquipos);

// Obtener un equipo por ID
router.get('/:id', equipoController.obtenerEquipoPorId);

// Actualizar equipo por ID
router.put('/:id', equipoController.actualizarEquipo);

// Eliminar equipo por ID (opcional)
router.delete('/:id', equipoController.eliminarEquipo);

module.exports = router;
