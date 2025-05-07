const { PrismaClient } = require('@prisma/client');
const BaseController = require('./BaseController');

const prisma = new PrismaClient();

class PacienteController extends BaseController {
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
      console.log('📋 Listando pacientes');
      const pacientes = await prisma.paciente.findMany({
        include: {
          sexo: true
        },
        orderBy: {
          nomeCompleto: 'asc'
        }
      });
      return this.sendResponse(res, pacientes);
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  async buscar(req, res) {
    try {
      const { id } = req.params;
      console.log('🔍 Buscando paciente:', { id });

      const paciente = await prisma.paciente.findUnique({
        where: { idPaciente: Number(id) },
        include: {
          sexo: true
        }
      });

      console.log('Paciente encontrado:', paciente);

      if (!paciente) {
        console.log('❌ Paciente não encontrado:', { id });
        return this.sendResponse(res, { error: 'Paciente não encontrado' }, 404);
      }

      return this.sendResponse(res, paciente);
    } catch (error) {
      console.error('❌ Erro ao buscar paciente:', {
        error: error.message,
        stack: error.stack
      });
      return this.handleError(error, res);
    }
  }

  async criar(req, res) {
    try {
      console.log('➕ Criando novo paciente:', req.body);

      // Validação dos campos obrigatórios
      const camposObrigatorios = [
        'nomeCompleto',
        'dataNascimento',
        'nomeMae',
        'CPF',
        'numSUS',
        'idSexo',
        'CEP',
        'endereco',
        'numero',
        'bairro',
        'cidade',
        'uf'
      ];

      const camposFaltantes = camposObrigatorios.filter(campo => !req.body[campo]);
      if (camposFaltantes.length > 0) {
        console.log('Campos obrigatórios ausentes:', camposFaltantes);
        console.log('Dados recebidos:', req.body);
        return this.sendResponse(res, { error: `Campos obrigatórios ausentes: ${camposFaltantes.join(', ')}` }, 400);
      }

      // Verifica se já existe um paciente com o mesmo CPF ou número do SUS
      const pacienteExistente = await prisma.paciente.findFirst({
        where: {
          OR: [
            { CPF: req.body.CPF },
            { numSUS: req.body.numSUS }
          ]
        }
      });

      if (pacienteExistente) {
        if (pacienteExistente.CPF === req.body.CPF) {
          console.log('❌ CPF já cadastrado:', req.body.CPF);
          return this.sendResponse(res, { error: 'CPF já cadastrado para outro paciente' }, 400);
        }
        if (pacienteExistente.numSUS === req.body.numSUS) {
          console.log('❌ Número do SUS já cadastrado:', req.body.numSUS);
          return this.sendResponse(res, { error: 'Número do Cartão SUS já cadastrado para outro paciente' }, 400);
        }
      }

      const dadosPaciente = {
        nomeCompleto: req.body.nomeCompleto,
        dataNascimento: new Date(req.body.dataNascimento),
        nomeMae: req.body.nomeMae,
        nomePai: req.body.nomePai || null,
        CPF: req.body.CPF,
        numSUS: req.body.numSUS,
        idSexo: Number(req.body.idSexo),
        CEP: req.body.CEP,
        endereco: req.body.endereco,
        numero: req.body.numero,
        complemento: req.body.complemento || null,
        bairro: req.body.bairro,
        cidade: req.body.cidade,
        uf: req.body.uf
      };

      console.log('Dados formatados para criação:', dadosPaciente);

      const paciente = await prisma.paciente.create({
        data: dadosPaciente,
        include: {
          sexo: true
        }
      });

      console.log('✅ Paciente criado com sucesso:', paciente);
      return this.sendResponse(res, paciente, 201);
    } catch (error) {
      console.error('❌ Erro ao criar paciente:', {
        error: error.message,
        stack: error.stack,
        data: req.body
      });
      return this.handleError(error, res);
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      console.log('🔄 Atualizando paciente:', { id });

      // Verifica se o paciente existe
      const pacienteExistente = await prisma.paciente.findUnique({
        where: { idPaciente: Number(id) }
      });

      if (!pacienteExistente) {
        console.log('❌ Paciente não encontrado para atualização:', { id });
        return this.sendResponse(res, { error: 'Paciente não encontrado' }, 404);
      }

      console.log('Dados recebidos para atualização:', req.body);

      const paciente = await prisma.paciente.update({
        where: { idPaciente: Number(id) },
        data: {
          ...req.body,
          idSexo: req.body.idSexo ? Number(req.body.idSexo) : undefined
        },
        include: {
          sexo: true
        }
      });

      console.log('✅ Paciente atualizado com sucesso:', paciente);
      return this.sendResponse(res, paciente);
    } catch (error) {
      console.error('❌ Erro ao atualizar paciente:', {
        error: error.message,
        stack: error.stack
      });
      return this.handleError(error, res);
    }
  }

  async excluir(req, res) {
    try {
      const { id } = req.params;
      console.log('🗑️ Excluindo paciente:', { id });

      // Verifica se o paciente existe
      const pacienteExistente = await prisma.paciente.findUnique({
        where: { id: Number(id) }
      });

      if (!pacienteExistente) {
        return this.sendResponse(res, { error: 'Paciente não encontrado' }, 404);
      }

      await prisma.paciente.delete({
        where: { id: Number(id) }
      });

      console.log('✅ Paciente excluído:', { id });
      return this.sendResponse(res, { message: 'Paciente excluído com sucesso' });
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

module.exports = new PacienteController(); 