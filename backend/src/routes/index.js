const express = require('express');
const router = express.Router();
const authRoutes = require('./authRoutes');
const pacienteRoutes = require('./pacienteRoutes');
const sexoRoutes = require('./sexoRoutes');
const usuarioRoutes = require('./usuarioRoutes');

// Rotas de autenticação (públicas)
router.use('/auth', authRoutes);

// Rotas protegidas
router.use('/paciente', pacienteRoutes);
router.use('/sexo', sexoRoutes);
router.use('/usuario', usuarioRoutes);

module.exports = router; 