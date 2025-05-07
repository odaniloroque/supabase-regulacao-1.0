import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { sexoService } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Sexos() {
  const router = useRouter();
  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  useEffect(() => {
    carregarSexos();
  }, []);

  const carregarSexos = async () => {
    try {
      const response = await sexoService.listar();
      setSexos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar sexos');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });

    const sortedData = [...sexos].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setSexos(sortedData);
  };

  const handleEdit = (id: number) => {
    router.push(`/sexo/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este sexo?')) {
      try {
        await sexoService.excluir(id);
        toast.success('Sexo excluído com sucesso');
        carregarSexos();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao excluir sexo');
      }
    }
  };

  const handleAdd = () => {
    router.push('/sexo/criar/0');
  };

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Sexos</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Novo Sexo
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table
            columns={columns}
            data={sexos}
            sortConfig={sortConfig}
            onSort={handleSort}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
} 