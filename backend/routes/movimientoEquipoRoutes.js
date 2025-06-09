const express = require('express');
const router = express.Router();
const movimientoEquipoController = require('../controllers/movimientoEquipoController');

// Registrar movimiento de equipo
router.post('/', movimientoEquipoController.crearMovimiento);
// Listar movimientos de equipos
router.get('/', movimientoEquipoController.listarMovimientos);

module.exports = router;
