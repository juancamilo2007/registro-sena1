const express = require('express');
const router = express.Router();
const sesionGuardiaController = require('../controllers/sesionGuardiaController');

// Crear sesión de guardia
router.post('/', sesionGuardiaController.crearSesion);
// Listar sesiones de guardias
router.get('/', sesionGuardiaController.listarSesiones);
// Cerrar sesión de guardia
router.put('/:id/cerrar', sesionGuardiaController.cerrarSesion);

module.exports = router;
