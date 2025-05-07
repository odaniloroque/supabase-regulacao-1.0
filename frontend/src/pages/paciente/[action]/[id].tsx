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

interface FormData {
  [key: string]: string;
  nomeCompleto: string;
  dataNascimento: string;
  nomeMae: string;
  nomePai: string;
  cpf: string;
  numeroSUS: string;
  idSexo: string;
  CEP: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  uf: string;
}

export default function PacienteForm() {
  const router = useRouter();
  const { action, id } = router.query;
  const isEdit = action === 'editar';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
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

  const [sexos, setSexos] = useState([]);

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
        try {
          console.log('Buscando paciente:', { id });
          const pacienteResponse = await pacienteService.buscar(Number(id));
          console.log('Resposta completa da API:', pacienteResponse);
          console.log('Dados do paciente:', pacienteResponse.data);
          
          if (!pacienteResponse.data) {
            console.error('Resposta vazia da API');
            throw new Error('Dados do paciente não encontrados');
          }

          const paciente = pacienteResponse.data;
          console.log('Dados do paciente antes do mapeamento:', paciente);
          
          const formDataMapped = {
            nomeCompleto: paciente.nomeCompleto || '',
            dataNascimento: paciente.dataNascimento ? new Date(paciente.dataNascimento).toISOString().split('T')[0] : '',
            nomeMae: paciente.nomeMae || '',
            nomePai: paciente.nomePai || '',
            cpf: paciente.CPF || '',
            numeroSUS: paciente.numSUS || '',
            idSexo: paciente.idSexo ? paciente.idSexo.toString() : '',
            CEP: paciente.CEP || '',
            endereco: paciente.endereco || '',
            numero: paciente.numero || '',
            complemento: paciente.complemento || '',
            bairro: paciente.bairro || '',
            cidade: paciente.cidade || '',
            uf: paciente.uf || '',
          };
          
          console.log('Dados mapeados para o formulário:', formDataMapped);
          setFormData(formDataMapped);
        } catch (error: any) {
          console.error('Erro detalhado ao carregar dados do paciente:', {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            stack: error.stack
          });
          toast.error(error.response?.data?.error || 'Erro ao carregar dados do paciente');
          router.push('/paciente');
        }
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
    
    if (name === 'cpf') {
      // Formata o CPF enquanto digita
      const cpfNumeros = value.replace(/\D/g, '');
      const cpfFormatado = cpfNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
      setFormData(prev => ({ ...prev, [name]: cpfFormatado }));
    } else if (name === 'CEP') {
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
      console.log('Dados do formulário antes do envio:', formData);

      // Validação básica dos campos obrigatórios
      const camposObrigatorios = [
        'nomeCompleto',
        'dataNascimento',
        'nomeMae',
        'cpf',
        'numeroSUS',
        'idSexo',
        'CEP',
        'endereco',
        'numero',
        'bairro',
        'cidade',
        'uf'
      ];

      const camposFaltantes = camposObrigatorios.filter(campo => !formData[campo]);
      if (camposFaltantes.length > 0) {
        toast.error(`Por favor, preencha todos os campos obrigatórios: ${camposFaltantes.join(', ')}`);
        return;
      }

      const dadosPaciente = {
        nomeCompleto: formData.nomeCompleto.trim(),
        dataNascimento: formData.dataNascimento,
        nomeMae: formData.nomeMae.trim(),
        nomePai: formData.nomePai?.trim() || null,
        CPF: formData.cpf.replace(/\D/g, ''),
        numSUS: formData.numeroSUS.replace(/\D/g, ''),
        idSexo: Number(formData.idSexo),
        CEP: formData.CEP.replace(/\D/g, ''),
        endereco: formData.endereco.trim(),
        numero: formData.numero.trim(),
        complemento: formData.complemento?.trim() || null,
        bairro: formData.bairro.trim(),
        cidade: formData.cidade.trim(),
        uf: formData.uf.trim()
      };

      console.log('Dados formatados para envio:', dadosPaciente);

      if (isEdit) {
        console.log('Atualizando paciente:', { id, dados: dadosPaciente });
        await pacienteService.atualizar(Number(id), dadosPaciente);
        toast.success('Paciente atualizado com sucesso');
      } else {
        console.log('Criando novo paciente:', dadosPaciente);
        const response = await pacienteService.criar(dadosPaciente);
        console.log('Resposta da criação:', response);
        toast.success('Paciente criado com sucesso');
      }
      router.push('/paciente');
    } catch (error: any) {
      console.error('Erro ao salvar paciente:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data
      });
      
      if (error.response?.data?.error) {
        if (error.response.data.error.includes('CPF já cadastrado')) {
          toast.error('Este CPF já está cadastrado para outro paciente. Por favor, verifique o número e tente novamente.');
        } else if (error.response.data.error.includes('Número do Cartão SUS já cadastrado')) {
          toast.error('Este número do Cartão SUS já está cadastrado para outro paciente. Por favor, verifique o número e tente novamente.');
        } else {
          toast.error(error.response.data.error);
        }
      } else if (error.response?.status === 400) {
        toast.error('Dados inválidos. Por favor, verifique os campos preenchidos.');
      } else {
        toast.error('Erro ao salvar paciente. Por favor, tente novamente.');
      }
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
                maxLength={2}
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