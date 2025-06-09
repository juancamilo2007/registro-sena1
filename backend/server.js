const express = require('express');
const connectDB = require('./config/database');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Importar rutas
const equipoRoutes = require('./routes/equipoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const sesionGuardiaRoutes = require('./routes/sesionGuardiaRoutes');
const movimientoEquipoRoutes = require('./routes/movimientoEquipoRoutes');
const estadisticaRoutes = require('./routes/estadisticaRoutes');

// Middleware para leer JSON
app.use(express.json());
app.use(cors());

// Conectar a la base de datos
connectDB();

// Ruta raíz simple
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

// Usar rutas de equipo
app.use('/api/equipos', equipoRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/sesiones-guardia', sesionGuardiaRoutes);
app.use('/api/movimientos-equipo', movimientoEquipoRoutes);
app.use('/api/estadisticas', estadisticaRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
