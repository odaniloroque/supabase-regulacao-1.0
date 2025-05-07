import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import { Table } from '../../components/Table';
import { usuarioService } from '../../services/api';
import { toast } from 'react-hot-toast';

export default function Usuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState({ key: 'nome', direction: 'asc' });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await usuarioService.listar();
      setUsuarios(response.data);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
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

    const sortedData = [...usuarios].sort((a: any, b: any) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setUsuarios(sortedData);
  };

  const handleEdit = (id: number) => {
    router.push(`/usuario/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await usuarioService.excluir(id);
        toast.success('Usuário excluído com sucesso');
        carregarUsuarios();
      } catch (error: any) {
        toast.error(error.response?.data?.error || 'Erro ao excluir usuário');
      }
    }
  };

  const handleAdd = () => {
    router.push('/usuario/criar');
  };

  const columns = [
    { key: 'nome', label: 'Nome', sortable: true },
    { key: 'email', label: 'E-mail', sortable: true },
    { key: 'tipo', label: 'Tipo', sortable: true },
  ];

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Novo Usuário
          </button>
        </div>

        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table
            columns={columns}
            data={usuarios}
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