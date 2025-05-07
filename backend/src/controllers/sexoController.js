const { PrismaClient } = require('@prisma/client');
const BaseController = require('./BaseController');

const prisma = new PrismaClient();

class SexoController extends BaseController {
  constructor() {
    super();
    this.listar = this.listar.bind(this);
    this.buscar = this.buscar.bind(this);
    this.criar = this.criar.bind(this);
    this.atualizar = this.atualizar.bind(this);
    this.excluir = this.excluir.bind(this);
  }

  async listar(req, res) {
    try {
      console.log('📋 Listando sexos');
      const sexos = await prisma.sexo.findMany({
        orderBy: {
          nome: 'asc'
        }
      });
      return this.sendResponse(res, sexos);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Buscando sexo:', { id });

      const sexo = await prisma.sexo.findUnique({
        where: { id: Number(id) }
      });

      if (!sexo) {
        return this.sendResponse(res, { error: 'Sexo não encontrado' }, 404);
      }

      return this.sendResponse(res, sexo);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async criar(req, res) {
    try {
      console.log('➕ Criando novo sexo:', req.body);

      // Validação dos campos obrigatórios
      this.validateRequiredFields(req.body, ['nome']);

      const sexo = await prisma.sexo.create({
        data: req.body
      });

      console.log('✅ Sexo criado:', { id: sexo.id });
      return this.sendResponse(res, sexo, 201);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      console.log('🔄 Atualizando sexo:', { id });

      // Verifica se o sexo existe
      const sexoExistente = await prisma.sexo.findUnique({
        where: { id: Number(id) }
      });

      if (!sexoExistente) {
        return this.sendResponse(res, { error: 'Sexo não encontrado' }, 404);
      }

      const sexo = await prisma.sexo.update({
        where: { id: Number(id) },
        data: req.body
      });

      console.log('✅ Sexo atualizado:', { id });
      return this.sendResponse(res, sexo);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Excluindo sexo:', { id });

      // Verifica se o sexo existe
      const sexoExistente = await prisma.sexo.findUnique({
        where: { id: Number(id) }
      });

      if (!sexoExistente) {
        return this.sendResponse(res, { error: 'Sexo não encontrado' }, 404);
      }

      await prisma.sexo.delete({
        where: { id: Number(id) }
      });

      console.log('✅ Sexo excluído:', { id });
      return this.sendResponse(res, { message: 'Sexo excluído com sucesso' });
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

module.exports = new SexoController(); 