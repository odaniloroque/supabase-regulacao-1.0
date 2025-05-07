const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

const authController = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;
      console.log('Tentativa de login:', { email });

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está definido no .env');
        return res.status(500).json({ error: 'Configuração do servidor incompleta' });
      }

      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        console.log('Usuário não encontrado:', email);
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      console.log('Usuário encontrado:', { id: usuario.id, nome: usuario.nome });

      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      console.log('Senha válida:', senhaValida);

      if (!senhaValida) {
        console.log('Senha inválida para usuário:', email);
        return res.status(401).json({ error: 'Senha inválida' });
      }

      try {
        const token = jwt.sign(
          { 
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
          }, 
          process.env.JWT_SECRET, 
          { expiresIn: '1d' }
        );

        const response = {
          usuario: {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email
          },
          token
        };

        console.log('Login bem sucedido:', { id: usuario.id, nome: usuario.nome });
        return res.json(response);
      } catch (jwtError) {
        console.error('Erro ao gerar token JWT:', jwtError);
        return res.status(500).json({ error: 'Erro ao gerar token de autenticação' });
      }
    } catch (error) {
      console.error('Erro detalhado no login:', error);
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: error.message 
      });
    }
  }
};

module.exports = authController; 