import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import Table from '../../components/Table';
import { pacienteService } from '../../services/api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface Sexo {
  idSexo: number;
  nome: string;
}

interface Paciente {
  idPaciente: number;
  nomeCompleto: string;
  CPF: string;
  numSUS: string;
  dataNascimento: string;
  sexo: Sexo;
  cidade: string;
  uf: string;
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: any) => string;
}

const formatCPF = (cpf: string) => {
  if (!cpf) return '-';
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatDate = (date: string) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('pt-BR');
};

export default function Pacientes() {
  const router = useRouter();
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [pacientesFiltrados, setPacientesFiltrados] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Paciente; direction: 'asc' | 'desc' }>({ 
    key: 'nomeCompleto', 
    direction: 'asc' 
  });
  const [filtro, setFiltro] = useState('');

  const columns: Column<Paciente>[] = [
    { key: 'nomeCompleto', label: 'Nome Completo' },
    { key: 'CPF', label: 'CPF', render: (value) => formatCPF(value) },
    { key: 'numSUS', label: 'Cartão SUS' },
    { key: 'dataNascimento', label: 'Data de Nascimento', render: (value) => formatDate(value) },
    { key: 'sexo', label: 'Sexo', render: (value) => value?.nome || '-' },
    { key: 'cidade', label: 'Cidade' },
    { key: 'uf', label: 'UF' }
  ];

  useEffect(() => {
    carregarPacientes();
  }, []);

  useEffect(() => {
    filtrarPacientes();
  }, [filtro, pacientes]);

  const carregarPacientes = async () => {
    try {
      const response = await pacienteService.listar();
      setPacientes(response.data);
      setPacientesFiltrados(response.data);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      toast.error('Erro ao carregar pacientes');
    } finally {
      setLoading(false);
    }
  };

  const filtrarPacientes = () => {
    if (!filtro.trim()) {
      setPacientesFiltrados(pacientes);
      return;
    }

    const termoBusca = filtro.toLowerCase();
    const filtrados = pacientes.filter(paciente => 
      paciente.nomeCompleto.toLowerCase().includes(termoBusca) ||
      (paciente.CPF && paciente.CPF.replace(/\D/g, '').includes(termoBusca)) ||
      (paciente.numSUS && paciente.numSUS.toLowerCase().includes(termoBusca))
    );
    setPacientesFiltrados(filtrados);
  };

  const handleSort = (key: keyof Paciente) => {
    const direction: 'asc' | 'desc' = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });

    const sortedData = [...pacientesFiltrados].sort((a, b) => {
      if (key === 'sexo') {
        const aValue = a[key]?.nome || '';
        const bValue = b[key]?.nome || '';
        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      }

      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    setPacientesFiltrados(sortedData);
  };

  const handleEdit = (id: number) => {
    router.push(`/paciente/editar/${id}`);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este paciente?')) {
      try {
        await pacienteService.excluir(id);
        toast.success('Paciente excluído com sucesso');
        carregarPacientes();
      } catch (error) {
        console.error('Erro ao excluir paciente:', error);
        toast.error('Erro ao excluir paciente');
      }
    }
  };

  const handleNew = () => {
    router.push('/paciente/criar/novo');
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pacientes</h1>
          <button
            onClick={handleNew}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark flex items-center"
          >
            <FaPlus className="mr-2" />
            Novo Paciente
          </button>
        </div>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar por nome, CPF ou número do SUS..."
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
            data={pacientesFiltrados}
            isLoading={loading}
            onSort={handleSort}
            sortKey={sortConfig.key}
            sortDirection={sortConfig.direction}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </Layout>
  );
} 