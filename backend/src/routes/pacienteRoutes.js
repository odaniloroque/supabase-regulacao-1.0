const express = require('express');
const router = express.Router();
const pacienteController = require('../controllers/pacienteController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar todos os pacientes
router.get('/', pacienteController.listar);

// Buscar paciente por ID
router.get('/:id', pacienteController.buscar);

// Criar novo paciente
router.post('/', pacienteController.criar);

// Atualizar paciente
router.put('/:id', pacienteController.atualizar);

// Excluir paciente
router.delete('/:id', pacienteController.excluir);

module.exports = router; 