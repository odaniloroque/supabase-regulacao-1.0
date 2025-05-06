const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

const usuarioController = {
  async create(req, res) {
    try {
      const { nome, email, senha } = req.body;

      const usuarioExiste = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExiste) {
        return res.status(400).json({ error: 'Usuário já existe' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const usuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash
        }
      });

      // Remove a senha do objeto retornado
      const { senha: _, ...usuarioSemSenha } = usuario;

      return res.json(usuarioSemSenha);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar usuário' });
    }
  },

  async list(req, res) {
    try {
      const usuarios = await prisma.usuario.findMany({
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return res.json(usuarios);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar usuários' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const usuario = await prisma.usuario.findUnique({
        where: { id: Number(id) },
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      if (!usuario) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }

      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, senha } = req.body;

      const dadosAtualizacao = {
        nome,
        email
      };

      if (senha) {
        dadosAtualizacao.senha = await bcrypt.hash(senha, 10);
      }

      const usuario = await prisma.usuario.update({
        where: { id: Number(id) },
        data: dadosAtualizacao,
        select: {
          id: true,
          nome: true,
          email: true,
          createdAt: true,
          updatedAt: true
        }
      });

      return res.json(usuario);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.usuario.delete({
        where: { id: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar usuário' });
    }
  }
};

module.exports = usuarioController; 