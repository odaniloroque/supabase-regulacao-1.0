const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha);

      if (!senhaValida) {
        return res.status(401).json({ error: 'Senha inválida' });
      }

      const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, {
        expiresIn: '1d'
      });

      return res.json({
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email
        },
        token
      });
    } catch (error) {
      return res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = authController; 