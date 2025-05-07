import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { enderecoService } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Enderecos() {
  const router = useRouter();
  const [enderecos, setEnderecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'endereco', direction: 'asc' });

  useEffect(() => {
    carregarEnderecos();
  }, []);

  const carregarEnderecos = async () => {
    try {
      const response = await enderecoService.listar();
      setEnderecos(response.data);
    } catch (error) {
      toast.error('Erro ao carregar endereços');
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

    const sortedData = [...enderecos].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setEnderecos(sortedData);
  };

  const handleEdit = (id: number) => {
    router.push(`/endereco/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este endereço?')) {
      try {
        await enderecoService.excluir(id);
        toast.success('Endereço excluído com sucesso');
        carregarEnderecos();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao excluir endereço');
      }
    }
  };

  const handleAdd = () => {
    router.push('/endereco/criar');
  };

  const columns = [
    { key: 'endereco', label: 'Endereço', sortable: true },
    { key: 'num', label: 'Número', sortable: true },
    { key: 'bairro', label: 'Bairro', sortable: true },
    { key: 'cidade', label: 'Cidade', sortable: true },
    { key: 'estado', label: 'Estado', sortable: true },
    { key: 'cep', label: 'CEP', sortable: true },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Endereços</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Novo Endereço
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table
            columns={columns}
            data={enderecos}
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