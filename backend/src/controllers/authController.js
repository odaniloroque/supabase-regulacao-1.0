const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const BaseController = require('./BaseController');
require('dotenv').config();

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const GOVBR_CLIENT_ID = process.env.GOVBR_CLIENT_ID;
const GOVBR_CLIENT_SECRET = process.env.GOVBR_CLIENT_SECRET;
const GOVBR_REDIRECT_URI = process.env.GOVBR_REDIRECT_URI || 'http://localhost:3000/login';

class AuthController extends BaseController {
  constructor() {
    super();
    this.login = this.login.bind(this);
    this.loginWithGovBr = this.loginWithGovBr.bind(this);
  }

  async login(req, res) {
    try {
      console.log('🔐 Tentativa de login:', { email: req.body.email });

      // Validação dos campos obrigatórios
      this.validateRequiredFields(req.body, ['email', 'senha']);

      // Validação do JWT_SECRET
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET não está definido no .env');
      }

      // Busca do usuário
      const usuario = await prisma.usuario.findUnique({
        where: { email: req.body.email }
      });

      if (!usuario) {
        console.log('❌ Usuário não encontrado:', req.body.email);
        return this.sendResponse(res, { error: 'Usuário não encontrado' }, 401);
      }

      console.log('✅ Usuário encontrado:', { 
        id: usuario.id, 
        nome: usuario.nome 
      });

      // Validação da senha
      const senhaValida = await bcrypt.compare(req.body.senha, usuario.senha);
      if (!senhaValida) {
        console.log('❌ Senha inválida para usuário:', req.body.email);
        return this.sendResponse(res, { error: 'Senha inválida' }, 401);
      }

      // Geração do token
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

      console.log('✅ Login bem sucedido:', { 
        id: usuario.id, 
        nome: usuario.nome 
      });

      return this.sendResponse(res, response);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async loginWithGovBr(req, res) {
    try {
      const { code } = req.body;

      if (!code) {
        return this.sendResponse(res, { error: 'Código de autorização não fornecido' }, 400);
      }

      // Trocar o código por um token de acesso
      const tokenResponse = await axios.post('https://sso.acesso.gov.br/token', {
        grant_type: 'authorization_code',
        code,
        redirect_uri: GOVBR_REDIRECT_URI,
        client_id: GOVBR_CLIENT_ID,
        client_secret: GOVBR_CLIENT_SECRET
      });

      const { access_token } = tokenResponse.data;

      // Obter informações do usuário
      const userResponse = await axios.get('https://sso.acesso.gov.br/userinfo', {
        headers: {
          Authorization: `Bearer ${access_token}`
        }
      });

      const { sub: govBrId, email, name } = userResponse.data;

      // Verificar se o usuário já existe
      let user = await prisma.usuario.findFirst({
        where: {
          OR: [
            { email },
            { govBrId }
          ]
        }
      });

      // Se não existir, criar um novo usuário
      if (!user) {
        user = await prisma.usuario.create({
          data: {
            nome: name,
            email,
            govBrId,
            tipo: 'usuario' // Tipo padrão para novos usuários
          }
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        { id: user.idUsuario, email: user.email, tipo: user.tipo },
        JWT_SECRET,
        { expiresIn: '1d' }
      );

      return this.sendResponse(res, {
        token,
        user: {
          idUsuario: user.idUsuario,
          nome: user.nome,
          email: user.email,
          tipo: user.tipo
        }
      });
    } catch (error) {
      console.error('Erro no login com GOV.BR:', error);
      return this.handleError(error, res);
    }
  }
}

module.exports = new AuthController(); 