const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os pacientes com suas relações
exports.listarPacientes = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      include: {
        sexo: true,
      },
    });
    res.json(pacientes);
  } catch (error) {
    console.error('Erro ao listar pacientes:', error);
    res.status(500).json({ error: 'Erro ao listar pacientes' });
  }
};

// Buscar paciente por ID
exports.buscarPaciente = async (req, res) => {
  try {
    const { id } = req.params;
    const paciente = await prisma.paciente.findUnique({
      where: { idPaciente: parseInt(id) },
      include: {
        sexo: true,
      },
    });

    if (!paciente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    res.json(paciente);
  } catch (error) {
    console.error('Erro ao buscar paciente:', error);
    res.status(500).json({ error: 'Erro ao buscar paciente' });
  }
};

// Criar novo paciente
exports.criarPaciente = async (req, res) => {
  try {
    const {
      nomeCompleto,
      dataNascimento,
      nomeMae,
      nomePai,
      cpf,
      numeroSUS,
      idSexo,
      CEP,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    } = req.body;

    // Verificar se o CPF já existe
    if (cpf) {
      const pacienteExistente = await prisma.paciente.findUnique({
        where: { CPF: cpf },
      });

      if (pacienteExistente) {
        return res.status(400).json({ error: 'CPF já cadastrado' });
      }
    }

    // Verificar se o número do SUS já existe
    if (numeroSUS) {
      const susExistente = await prisma.paciente.findUnique({
        where: { numSUS: numeroSUS },
      });

      if (susExistente) {
        return res.status(400).json({ error: 'Número do SUS já cadastrado' });
      }
    }

    const paciente = await prisma.paciente.create({
      data: {
        nomeCompleto,
        dataNascimento: new Date(dataNascimento),
        nomeMae,
        nomePai,
        CPF: cpf,
        numSUS: numeroSUS,
        idSexo: parseInt(idSexo),
        CEP,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
      },
      include: {
        sexo: true,
      },
    });

    res.status(201).json(paciente);
  } catch (error) {
    console.error('Erro ao criar paciente:', error);
    res.status(500).json({ error: 'Erro ao criar paciente' });
  }
};

// Atualizar paciente
exports.atualizarPaciente = async (req, res) => {
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
      CEP,
      endereco,
      numero,
      complemento,
      bairro,
      cidade,
      uf,
    } = req.body;

    // Verificar se o paciente existe
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { idPaciente: parseInt(id) },
    });

    if (!pacienteExistente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    // Verificar se o novo CPF já existe em outro paciente
    if (CPF !== pacienteExistente.CPF) {
      const cpfExistente = await prisma.paciente.findUnique({
        where: { CPF },
      });

      if (cpfExistente) {
        return res.status(400).json({ error: 'CPF já cadastrado para outro paciente' });
      }
    }

    // Verificar se o novo número do SUS já existe em outro paciente
    if (numSUS !== pacienteExistente.numSUS) {
      const susExistente = await prisma.paciente.findUnique({
        where: { numSUS },
      });

      if (susExistente) {
        return res.status(400).json({ error: 'Número do SUS já cadastrado para outro paciente' });
      }
    }

    const paciente = await prisma.paciente.update({
      where: { idPaciente: parseInt(id) },
      data: {
        nomeCompleto,
        dataNascimento: new Date(dataNascimento),
        nomeMae,
        nomePai,
        CPF,
        numSUS,
        idSexo,
        CEP,
        endereco,
        numero,
        complemento,
        bairro,
        cidade,
        uf,
      },
      include: {
        sexo: true,
      },
    });

    res.json(paciente);
  } catch (error) {
    console.error('Erro ao atualizar paciente:', error);
    res.status(500).json({ error: 'Erro ao atualizar paciente' });
  }
};

// Excluir paciente
exports.excluirPaciente = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o paciente existe
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { idPaciente: parseInt(id) },
    });

    if (!pacienteExistente) {
      return res.status(404).json({ error: 'Paciente não encontrado' });
    }

    await prisma.paciente.delete({
      where: { idPaciente: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir paciente:', error);
    res.status(500).json({ error: 'Erro ao excluir paciente' });
  }
}; 