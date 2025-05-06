const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pacienteController = {
  async create(req, res) {
    try {
      const {
        nomeCompleto,
        dataNascimento,
        nomeMae,
        nomePai,
        CPF,
        numSUS,
        idSexo,
        idEndereco
      } = req.body;

      const paciente = await prisma.paciente.create({
        data: {
          nomeCompleto,
          dataNascimento: new Date(dataNascimento),
          nomeMae,
          nomePai,
          CPF,
          numSUS,
          idSexo,
          idEndereco
        },
        include: {
          sexo: true,
          endereco: true
        }
      });

      return res.json(paciente);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar paciente' });
    }
  },

  async list(req, res) {
    try {
      const pacientes = await prisma.paciente.findMany({
        include: {
          sexo: true,
          endereco: true
        }
      });

      return res.json(pacientes);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar pacientes' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const paciente = await prisma.paciente.findUnique({
        where: { idPaciente: Number(id) },
        include: {
          sexo: true,
          endereco: true
        }
      });

      if (!paciente) {
        return res.status(404).json({ error: 'Paciente não encontrado' });
      }

      return res.json(paciente);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar paciente' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const {
        nomeCompleto,
        dataNascimento,
        nomeMae,
        nomePai,
        CPF,
        numSUS,
        idSexo,
        idEndereco
      } = req.body;

      const paciente = await prisma.paciente.update({
        where: { idPaciente: Number(id) },
        data: {
          nomeCompleto,
          dataNascimento: new Date(dataNascimento),
          nomeMae,
          nomePai,
          CPF,
          numSUS,
          idSexo,
          idEndereco
        },
        include: {
          sexo: true,
          endereco: true
        }
      });

      return res.json(paciente);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar paciente' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.paciente.delete({
        where: { idPaciente: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar paciente' });
    }
  }
};

module.exports = pacienteController; 