const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sexoController = {
  async create(req, res) {
    try {
      const { nome } = req.body;

      const sexo = await prisma.sexo.create({
        data: { nome }
      });

      return res.json(sexo);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar sexo' });
    }
  },

  async list(req, res) {
    try {
      const sexos = await prisma.sexo.findMany();
      return res.json(sexos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar sexos' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const sexo = await prisma.sexo.findUnique({
        where: { idSexo: Number(id) }
      });

      if (!sexo) {
        return res.status(404).json({ error: 'Sexo não encontrado' });
      }

      return res.json(sexo);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar sexo' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome } = req.body;

      const sexo = await prisma.sexo.update({
        where: { idSexo: Number(id) },
        data: { nome }
      });

      return res.json(sexo);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar sexo' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.sexo.delete({
        where: { idSexo: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar sexo' });
    }
  }
};

module.exports = sexoController; 