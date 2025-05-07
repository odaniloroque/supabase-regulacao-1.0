import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const pacienteService = {
  listar: () => api.get('/paciente'),
  buscar: (id: number) => api.get(`/paciente/${id}`),
  criar: (data: any) => api.post('/paciente', data),
  atualizar: (id: number, data: any) => api.put(`/paciente/${id}`, data),
  excluir: (id: number) => api.delete(`/paciente/${id}`),
};

export const sexoService = {
  listar: () => api.get('/sexo'),
  buscar: (id: number) => api.get(`/sexo/${id}`),
  criar: (data: any) => api.post('/sexo', data),
  atualizar: (id: number, data: any) => api.put(`/sexo/${id}`, data),
  excluir: (id: number) => api.delete(`/sexo/${id}`),
};

export const usuarioService = {
  listar: () => api.get('/usuario'),
  buscar: (id: number) => api.get(`/usuario/${id}`),
  criar: (data: any) => api.post('/usuario', data),
  atualizar: (id: number, data: any) => api.put(`/usuario/${id}`, data),
  excluir: (id: number) => api.delete(`/usuario/${id}`),
};

export default api; 