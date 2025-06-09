const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registrar un nuevo usuario
exports.registrarUsuario = async (req, res) => {
  const { nombre, correo, contraseña, esAdministrador } = req.body;
  try {
    const existe = await Usuario.findOne({ correo });
    if (existe) return res.status(400).json({ mensaje: 'El correo ya está registrado' });

    const usuario = new Usuario({ nombre, correo, contraseña, esAdministrador });
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};

// Iniciar sesión
exports.loginUsuario = async (req, res) => {
  const { correo, contraseña } = req.body;

  try {
    // Buscar solo por correo y seleccionar la contraseña
    const usuario = await Usuario.findOne({ correo }).select('+contraseña');
    if (!usuario) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    // Comparar la contraseña usando el método del modelo
    const esValida = await usuario.compararContraseña(contraseña);
    if (!esValida) return res.status(401).json({ mensaje: 'Credenciales incorrectas' });

    // No enviar la contraseña en la respuesta
    const usuarioObj = usuario.toObject();
    delete usuarioObj.contraseña;

    res.json(usuarioObj);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
};

// Obtener todos los usuarios
exports.listarUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// Obtener usuario por ID
exports.obtenerUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al obtener usuario' });
  }
};

// Actualizar usuario por ID (PUT)
exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario' });
  }
};

// Eliminar usuario por ID (DELETE)
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    res.json({ mensaje: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ mensaje: 'Error al eliminar usuario' });
  }
};
