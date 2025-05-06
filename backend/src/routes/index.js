const express = require('express');
const authController = require('../controllers/authController');
const pacienteController = require('../controllers/pacienteController');
const sexoController = require('../controllers/sexoController');
const enderecoController = require('../controllers/enderecoController');
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Rotas públicas
router.post('/auth/login', authController.login);
router.post('/usuarios', usuarioController.create);

// Rotas protegidas
router.use(authMiddleware);

// Rotas de Paciente
router.post('/pacientes', pacienteController.create);
router.get('/pacientes', pacienteController.list);
router.get('/pacientes/:id', pacienteController.getById);
router.put('/pacientes/:id', pacienteController.update);
router.delete('/pacientes/:id', pacienteController.delete);

// Rotas de Sexo
router.post('/sexos', sexoController.create);
router.get('/sexos', sexoController.list);
router.get('/sexos/:id', sexoController.getById);
router.put('/sexos/:id', sexoController.update);
router.delete('/sexos/:id', sexoController.delete);

// Rotas de Endereço
router.post('/enderecos', enderecoController.create);
router.get('/enderecos', enderecoController.list);
router.get('/enderecos/:id', enderecoController.getById);
router.put('/enderecos/:id', enderecoController.update);
router.delete('/enderecos/:id', enderecoController.delete);

// Rotas de Usuário
router.get('/usuarios', usuarioController.list);
router.get('/usuarios/:id', usuarioController.getById);
router.put('/usuarios/:id', usuarioController.update);
router.delete('/usuarios/:id', usuarioController.delete);

module.exports = router; 