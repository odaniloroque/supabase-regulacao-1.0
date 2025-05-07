import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/Layout';
import Table from '../../components/Table';
import { usuarioService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaSearch } from 'react-icons/fa';

interface Usuario {
  idUsuario: number;
  nome: string;
  email: string;
  tipo: string;
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any) => string;
}

export default function Usuarios() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Usuario; direction: 'asc' | 'desc' }>({ 
    key: 'nome', 
    direction: 'asc' 
  });
  const [filtro, setFiltro] = useState('');

  const columns: Column<Usuario>[] = [
    { key: 'nome', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'tipo', label: 'Tipo', render: (value) => value === 'admin' ? 'Administrador' : 'Usuário' }
  ];

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    filtrarUsuarios();
  }, [filtro, usuarios]);

  const carregarUsuarios = async () => {
    try {
      const response = await usuarioService.listar();
      setUsuarios(response.data);
      setUsuariosFiltrados(response.data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const filtrarUsuarios = () => {
    if (!filtro.trim()) {
      setUsuariosFiltrados(usuarios);
      return;
    }

    const termoBusca = filtro.toLowerCase();
    const filtrados = usuarios.filter(usuario => 
      usuario.nome.toLowerCase().includes(termoBusca) ||
      usuario.email.toLowerCase().includes(termoBusca)
    );
    setUsuariosFiltrados(filtrados);
  };

  const handleSort = (key: keyof Usuario) => {
    const direction: 'asc' | 'desc' = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...usuariosFiltrados].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setUsuariosFiltrados(sortedData);
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
        console.error('Erro ao excluir usuário:', error);
        toast.error(error.response?.data?.error || 'Erro ao excluir usuário');
      }
    }
  };

  const handleNew = () => {
    router.push('/usuario/criar');
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Usuários</h1>
          <button
            onClick={handleNew}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center"
          >
            <FaPlus className="mr-2" />
            Novo Usuário
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : (
          <Table
            columns={columns}
            data={usuariosFiltrados}
            isLoading={loading}
            onSort={handleSort}
            sortKey={sortConfig.key}
            sortDirection={sortConfig.direction}
            onEdit={handleEdit}
            onDelete={handleDelete}
            idField="idUsuario"
          />
        )}
      </div>
    </Layout>
  );
} 