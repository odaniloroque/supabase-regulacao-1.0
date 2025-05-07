import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { sexoService } from '../../../services/api';
import { toast } from 'react-hot-toast';

export default function SexoForm() {
  const router = useRouter();
  const { action, id } = router.query;
  const isEdit = action === 'editar';

  const [formData, setFormData] = useState({
    nome: '',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      carregarDados();
    }
  }, [router.isReady]);

  const carregarDados = async () => {
    try {
      if (isEdit && id) {
        const response = await sexoService.buscar(Number(id));
        setFormData({
          nome: response.data.nome,
        });
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await sexoService.atualizar(Number(id), formData);
        toast.success('Sexo atualizado com sucesso');
      } else {
        await sexoService.criar(formData);
        toast.success('Sexo criado com sucesso');
      }
      router.push('/sexo');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar sexo');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="p-6">
          <div className="text-center py-4">Carregando...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Editar Sexo' : 'Novo Sexo'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/sexo')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              {isEdit ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 