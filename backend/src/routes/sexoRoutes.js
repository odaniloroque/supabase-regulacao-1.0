const express = require('express');
const router = express.Router();
const sexoController = require('../controllers/sexoController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar todos os sexos
router.get('/', sexoController.listar);

// Buscar sexo por ID
router.get('/:id', sexoController.buscar);

// Criar novo sexo
router.post('/', sexoController.criar);

// Atualizar sexo
router.put('/:id', sexoController.atualizar);

// Excluir sexo
router.delete('/:id', sexoController.excluir);

module.exports = router; 