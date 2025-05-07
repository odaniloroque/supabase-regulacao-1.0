const express = require('express');
const router = express.Router();
const sexoController = require('../controllers/sexoController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar todos os sexos
router.get('/', sexoController.listarSexos);

// Buscar sexo por ID
router.get('/:id', sexoController.buscarSexo);

// Criar novo sexo
router.post('/', sexoController.criarSexo);

// Atualizar sexo
router.put('/:id', sexoController.atualizarSexo);

// Excluir sexo
router.delete('/:id', sexoController.excluirSexo);

module.exports = router; 