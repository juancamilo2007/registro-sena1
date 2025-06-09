const express = require('express');
const router = express.Router();
const estadisticaController = require('../controllers/estadisticaController');

// Crear estadística
router.post('/', estadisticaController.crearEstadistica);
// Listar estadísticas
router.get('/', estadisticaController.listarEstadisticas);
// Obtener estadística por fecha
router.get('/:fecha', estadisticaController.obtenerPorFecha);

module.exports = router;
