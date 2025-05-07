const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const authMiddleware = require('../middleware/authMiddleware');

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Listar todos os usuários
router.get('/', usuarioController.listarUsuarios);

// Buscar usuário por ID
router.get('/:id', usuarioController.buscarUsuario);

// Criar novo usuário
router.post('/', usuarioController.criarUsuario);

// Atualizar usuário
router.put('/:id', usuarioController.atualizarUsuario);

// Excluir usuário
router.delete('/:id', usuarioController.excluirUsuario);

module.exports = router; 