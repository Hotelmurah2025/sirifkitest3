import api from '../lib/api';
import { ApiResponse, Transaction } from '../types';

export const transactionService = {
  getAll: async (hotelId?: string, reservationId?: string, status?: string) => {
    let url = '/transactions';
    const params = new URLSearchParams();
    
    if (hotelId) params.append('hotel_id', hotelId);
    if (reservationId) params.append('reservation_id', reservationId);
    if (status) params.append('status', status);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get<ApiResponse<Transaction[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Transaction>>(`/transactions/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Transaction>) => {
    const response = await api.post<ApiResponse<Transaction>>('/transactions', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Transaction>) => {
    const response = await api.put<ApiResponse<Transaction>>(`/transactions/${id}`, data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: Transaction['status_pembayaran']) => {
    const response = await api.patch<ApiResponse<Transaction>>(`/transactions/${id}/status`, { status });
    return response.data;
  },
  
  uploadPaymentProof: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('bukti_pembayaran', file);
    
    const response = await api.post<ApiResponse<Transaction>>(`/transactions/${id}/upload-proof`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/transactions/${id}`);
    return response.data;
  }
};
