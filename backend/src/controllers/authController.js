const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const prisma = new PrismaClient();

const authController = {
  async login(req, res) {
    try {
      console.log('Recebendo requisição de login:', {
        method: req.method,
        body: req.body,
        headers: req.headers
      });

      const { email, senha } = req.body;
      
      if (!email || !senha) {
        console.log('Dados de login incompletos:', { email: !!email, senha: !!senha });
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      if (!process.env.JWT_SECRET) {
        console.error('JWT_SECRET não está definido no .env');
        return res.status(500).json({ error: 'Configuração do servidor incompleta' });
      }

      console.log('Buscando usuário no banco de dados:', { email });
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        console.log('Usuário não encontrado:', email);
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      console.log('Usuário encontrado:', { 
        id: usuario.id, 
        nome: usuario.nome,
        email: usuario.email 
      });

      console.log('Verificando senha...');
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      console.log('Resultado da verificação da senha:', senhaValida);

      if (!senhaValida) {
        console.log('Senha inválida para usuário:', email);
        return res.status(401).json({ error: 'Senha inválida' });
      }

      try {
        console.log('Gerando token JWT...');
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

        console.log('Login bem sucedido:', { 
          id: usuario.id, 
          nome: usuario.nome,
          tokenLength: token.length 
        });
        
        return res.json(response);
      } catch (jwtError) {
        console.error('Erro ao gerar token JWT:', jwtError);
        return res.status(500).json({ error: 'Erro ao gerar token de autenticação' });
      }
    } catch (error) {
      console.error('Erro detalhado no login:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      return res.status(500).json({ 
        error: 'Erro interno do servidor',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
};

module.exports = authController; 