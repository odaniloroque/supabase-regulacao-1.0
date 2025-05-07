import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AuthResponse {
  token: string;
  user: {
    idUsuario: number;
    nome: string;
    email: string;
    tipo: string;
  };
}

class AuthService {
  private token: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  async login(email: string, senha: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, senha });
      const { token, user } = response.data;
      
      this.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    }
  }

  async loginWithGovBr(code: string): Promise<AuthResponse> {
    try {
      const response = await axios.post(`${API_URL}/auth/govbr`, { code });
      const { token, user } = response.data;
      
      this.token = token;
      if (typeof window !== 'undefined') {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login com GOV.BR:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getUser() {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        return JSON.parse(userStr);
      }
    }
    return null;
  }
}

export const authService = new AuthService(); 