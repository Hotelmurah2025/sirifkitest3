import { useState, useEffect } from 'react';
import { User } from '../types';
import { authService } from '../services/auth.service';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(credentials);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        setUser(user);
        setToken(token);
        
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true };
      } else {
        throw new Error(response.message || 'Login gagal');
      }
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || 'Terjadi kesalahan saat login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const getProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.getProfile();
      
      if (response.success && response.data) {
        const userData = response.data;
        
        setUser(userData);
        
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true, user: userData };
      } else {
        throw new Error(response.message || 'Gagal mendapatkan profil');
      }
    } catch (err: unknown) {
      const error = err as Error;
      const errorMessage = error.message || 'Terjadi kesalahan saat mengambil profil';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated: !!token,
    login,
    logout,
    getProfile
  };
};
