import api from '../lib/api';
import { ApiResponse, User } from '../types';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  nama: string;
  email: string;
  password: string;
  role: 'admin' | 'owner' | 'staff';
  hotel_id?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', credentials);
    return response.data;
  },
  
  register: async (data: RegisterData) => {
    const response = await api.post<ApiResponse<User>>('/auth/register', data);
    return response.data;
  },
  
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/profile');
    return response.data;
  },
  
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>('/auth/profile', data);
    return response.data;
  },
  
  changePassword: async (data: { oldPassword: string; newPassword: string }) => {
    const response = await api.put<ApiResponse<null>>('/auth/change-password', data);
    return response.data;
  }
};
