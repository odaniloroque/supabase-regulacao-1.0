import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { pacienteService, sexoService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { validarCPF } from '@/utils/validators';

interface Endereco {
  endereco: string;
  num: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

interface Sexo {
  idSexo: number;
  nome: string;
}

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function CriarPaciente() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loadingSexos, setLoadingSexos] = useState(true);
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    nomeMae: '',
    nomePai: '',
    cpf: '',
    numeroSUS: '',
    idSexo: '',
    CEP: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: ''
  });

  const [sexos, setSexos] = useState<Sexo[]>([]);

  React.useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      setLoadingSexos(true);
      const [sexosResponse] = await Promise.all([
        sexoService.listar(),
      ]);

      setSexos(sexosResponse.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoadingSexos(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'cpf') {
      const cpfNumeros = value.replace(/\D/g, '');
      const cpfFormatado = cpfNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
    } else if (name === 'CEP') {
      const cepNumeros = value.replace(/\D/g, '');
      const cepFormatado = cepNumeros.replace(/(\d{5})(\d{3})/, '$1-$2');
      setFormData(prev => ({ ...prev, [name]: cepFormatado }));
      
      if (cepNumeros.length === 8) {
        buscarCep(cepNumeros);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const buscarCep = async (cep: string) => {
    try {
      const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cep}/json/`);
      
      if (response.data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      setFormData(prev => ({
        ...prev,
        endereco: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        uf: response.data.uf,
        complemento: response.data.complemento
      }));
    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validarCPF(formData.cpf.replace(/\D/g, ''))) {
      toast.error('CPF inválido');
      return;
    }

    setLoading(true);
    try {
      const dadosPaciente = {
        ...formData,
        cpf: formData.cpf.replace(/\D/g, ''),
        CEP: formData.CEP.replace(/\D/g, '')
      };

      console.log('Dados do paciente sendo enviados:', dadosPaciente);
      const response = await pacienteService.criar(dadosPaciente);
      console.log('Resposta da API:', response.data);

      toast.success('Paciente criado com sucesso!');
      router.push('/paciente');
    } catch (error: any) {
      console.error('Erro detalhado:', error);
      toast.error(error.response?.data?.message || 'Erro ao criar paciente');
    } finally {
      setLoading(false);
    }
  };

  if (loadingSexos) {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Novo Paciente</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Data de Nascimento</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nome da Mãe</label>
              <input
                type="text"
                name="nomeMae"
                value={formData.nomeMae}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Nome do Pai</label>
              <input
                type="text"
                name="nomePai"
                value={formData.nomePai}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CPF</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                placeholder="000.000.000-00"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número do SUS</label>
              <input
                type="text"
                name="numeroSUS"
                value={formData.numeroSUS}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Sexo</label>
              <select
                name="idSexo"
                value={formData.idSexo}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              >
                <option value="">Selecione...</option>
                {sexos.map((sexo: Sexo) => (
                  <option key={sexo.idSexo} value={sexo.idSexo}>
                    {sexo.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Endereço</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">CEP</label>
                <input
                  type="text"
                  name="CEP"
                  value={formData.CEP}
                  onChange={handleChange}
                  required
                  placeholder="00000-000"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Número</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Complemento</label>
                <input
                  type="text"
                  name="complemento"
                  value={formData.complemento}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">UF</label>
                <input
                  type="text"
                  name="uf"
                  value={formData.uf}
                  onChange={handleChange}
                  required
                  maxLength={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/paciente')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
            >
              {loading ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
} 