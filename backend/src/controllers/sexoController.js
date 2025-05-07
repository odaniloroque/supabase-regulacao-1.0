const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Listar todos os sexos
exports.listarSexos = async (req, res) => {
  try {
    const sexos = await prisma.sexo.findMany();
    res.json(sexos);
  } catch (error) {
    console.error('Erro ao listar sexos:', error);
    res.status(500).json({ error: 'Erro ao listar sexos' });
  }
};

// Buscar sexo por ID
exports.buscarSexo = async (req, res) => {
  try {
    const { id } = req.params;
    const sexo = await prisma.sexo.findUnique({
      where: { idSexo: parseInt(id) },
    });

    if (!sexo) {
      return res.status(404).json({ error: 'Sexo não encontrado' });
    }

    res.json(sexo);
  } catch (error) {
    console.error('Erro ao buscar sexo:', error);
    res.status(500).json({ error: 'Erro ao buscar sexo' });
  }
};

// Criar novo sexo
exports.criarSexo = async (req, res) => {
  try {
    const { nome } = req.body;

    // Verificar se o nome já existe
    const sexoExistente = await prisma.sexo.findUnique({
      where: { nome },
    });

    if (sexoExistente) {
      return res.status(400).json({ error: 'Sexo já cadastrado' });
    }

    const sexo = await prisma.sexo.create({
      data: { nome },
    });

    res.status(201).json(sexo);
  } catch (error) {
    console.error('Erro ao criar sexo:', error);
    res.status(500).json({ error: 'Erro ao criar sexo' });
  }
};

// Atualizar sexo
exports.atualizarSexo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    // Verificar se o sexo existe
    const sexoExistente = await prisma.sexo.findUnique({
      where: { idSexo: parseInt(id) },
    });

    if (!sexoExistente) {
      return res.status(404).json({ error: 'Sexo não encontrado' });
    }

    // Verificar se o novo nome já existe em outro sexo
    if (nome !== sexoExistente.nome) {
      const nomeExistente = await prisma.sexo.findUnique({
        where: { nome },
      });

      if (nomeExistente) {
        return res.status(400).json({ error: 'Nome já cadastrado para outro sexo' });
      }
    }

    const sexo = await prisma.sexo.update({
      where: { idSexo: parseInt(id) },
      data: { nome },
    });

    res.json(sexo);
  } catch (error) {
    console.error('Erro ao atualizar sexo:', error);
    res.status(500).json({ error: 'Erro ao atualizar sexo' });
  }
};

// Excluir sexo
exports.excluirSexo = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar se o sexo existe
    const sexoExistente = await prisma.sexo.findUnique({
      where: { idSexo: parseInt(id) },
      include: {
        pacientes: true,
      },
    });

    if (!sexoExistente) {
      return res.status(404).json({ error: 'Sexo não encontrado' });
    }

    // Verificar se existem pacientes associados
    if (sexoExistente.pacientes.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir o sexo pois existem pacientes associados' 
      });
    }

    await prisma.sexo.delete({
      where: { idSexo: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir sexo:', error);
    res.status(500).json({ error: 'Erro ao excluir sexo' });
  }
}; 