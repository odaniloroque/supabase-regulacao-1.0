const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const enderecoController = {
  async create(req, res) {
    try {
      const { CEP, endereco, num, bairro, uf } = req.body;

      const novoEndereco = await prisma.endereco.create({
        data: {
          CEP,
          endereco,
          num,
          bairro,
          uf
        }
      });

      return res.json(novoEndereco);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao criar endereço' });
    }
  },

  async list(req, res) {
    try {
      const enderecos = await prisma.endereco.findMany();
      return res.json(enderecos);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao listar endereços' });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;

      const endereco = await prisma.endereco.findUnique({
        where: { idEndereco: Number(id) }
      });

      if (!endereco) {
        return res.status(404).json({ error: 'Endereço não encontrado' });
      }

      return res.json(endereco);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao buscar endereço' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const { CEP, endereco, num, bairro, uf } = req.body;

      const enderecoAtualizado = await prisma.endereco.update({
        where: { idEndereco: Number(id) },
        data: {
          CEP,
          endereco,
          num,
          bairro,
          uf
        }
      });

      return res.json(enderecoAtualizado);
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao atualizar endereço' });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;

      await prisma.endereco.delete({
        where: { idEndereco: Number(id) }
      });

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: 'Erro ao deletar endereço' });
    }
  }
};

module.exports = enderecoController; 