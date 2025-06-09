const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Registrar usuario
router.post('/registrar', usuarioController.registrarUsuario);

// Login
router.post('/login', usuarioController.loginUsuario);

// Obtener todos los usuarios
router.get('/', usuarioController.listarUsuarios);

// Obtener usuario por ID
router.get('/:id', usuarioController.obtenerUsuarioPorId);

// Eliminar usuario por ID
router.delete('/:id', usuarioController.eliminarUsuario);

module.exports = router;
