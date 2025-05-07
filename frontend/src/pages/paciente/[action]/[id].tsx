import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../../components/Layout';
import { pacienteService, sexoService } from '../../../services/api';
import { toast } from 'react-hot-toast';
import axios from 'axios';

interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  erro?: boolean;
}

export default function PacienteForm() {
  const router = useRouter();
  const { action, id } = router.query;
  const isEdit = action === 'editar';

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    dataNascimento: '',
    nomeMae: '',
    nomePai: '',
    CPF: '',
    numSUS: '',
    idSexo: '',
    CEP: '',
    endereco: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    uf: '',
  });

  const [sexos, setSexos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (router.isReady) {
      carregarDados();
    }
  }, [router.isReady]);

  const carregarDados = async () => {
    try {
      const sexosResponse = await sexoService.listar();
      setSexos(sexosResponse.data);

      if (isEdit && id) {
        const pacienteResponse = await pacienteService.buscar(Number(id));
        const paciente = pacienteResponse.data;
        setFormData({
          nomeCompleto: paciente.nomeCompleto,
          dataNascimento: new Date(paciente.dataNascimento).toISOString().split('T')[0],
          nomeMae: paciente.nomeMae,
          nomePai: paciente.nomePai || '',
          CPF: paciente.CPF,
          numSUS: paciente.numSUS,
          idSexo: paciente.idSexo.toString(),
          CEP: paciente.CEP,
          endereco: paciente.endereco,
          numero: paciente.numero,
          complemento: paciente.complemento || '',
          bairro: paciente.bairro,
          cidade: paciente.cidade,
          uf: paciente.uf,
        });
      }
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const buscarCep = async (cep: string) => {
    try {
      // Remove caracteres não numéricos
      const cepNumerico = cep.replace(/[^\d]/g, '');
      
      // Verifica se o CEP tem 8 dígitos
      if (cepNumerico.length !== 8) {
        return;
      }

      const response = await axios.get<ViaCepResponse>(`https://viacep.com.br/ws/${cepNumerico}/json/`);
      
      if (response.data.erro) {
        toast.error('CEP não encontrado');
        return;
      }

      // Atualiza os campos do endereço com os dados da API
      setFormData(prev => ({
        ...prev,
        endereco: response.data.logradouro,
        bairro: response.data.bairro,
        cidade: response.data.localidade,
        uf: response.data.uf,
        CEP: response.data.cep,
        // Mantém o número e complemento se já estiverem preenchidos
        numero: prev.numero,
        complemento: response.data.complemento || prev.complemento
      }));

    } catch (error) {
      toast.error('Erro ao buscar CEP');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'CEP') {
      // Formata o CEP enquanto digita
      const cepFormatado = value.replace(/\D/g, '').replace(/(\d{5})(\d)/, '$1-$2');
      setFormData(prev => ({ ...prev, [name]: cepFormatado }));
      
      // Busca o CEP quando tiver 8 dígitos
      if (value.replace(/\D/g, '').length === 8) {
        buscarCep(value);
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await pacienteService.atualizar(Number(id), formData);
        toast.success('Paciente atualizado com sucesso');
      } else {
        await pacienteService.criar(formData);
        toast.success('Paciente criado com sucesso');
      }
      router.push('/paciente');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Erro ao salvar paciente');
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
          {isEdit ? 'Editar Paciente' : 'Novo Paciente'}
        </h1>

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
                name="CPF"
                value={formData.CPF}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Número do SUS</label>
              <input
                type="text"
                name="numSUS"
                value={formData.numSUS}
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
                {sexos.map((sexo: any) => (
                  <option key={sexo.idSexo} value={sexo.idSexo}>
                    {sexo.nome}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">CEP</label>
              <input
                type="text"
                name="CEP"
                value={formData.CEP}
                onChange={handleChange}
                required
                maxLength={9}
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
              <label className="block text-sm font-medium text-gray-700">Estado</label>
              <input
                type="text"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
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