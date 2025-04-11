import api from '../lib/api';
import { ApiResponse, BankAccount } from '../types';

export const bankAccountService = {
  getAll: async (hotelId?: string) => {
    let url = '/bank-accounts';
    if (hotelId) {
      url += `?hotel_id=${hotelId}`;
    }
    
    const response = await api.get<ApiResponse<BankAccount[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<BankAccount>>(`/bank-accounts/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<BankAccount>) => {
    const response = await api.post<ApiResponse<BankAccount>>('/bank-accounts', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<BankAccount>) => {
    const response = await api.put<ApiResponse<BankAccount>>(`/bank-accounts/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/bank-accounts/${id}`);
    return response.data;
  }
};
