import api from '../lib/api';
import { ApiResponse, Reservation } from '../types';

export const reservationService = {
  getAll: async (hotelId?: string, status?: string) => {
    let url = '/reservations';
    const params = new URLSearchParams();
    
    if (hotelId) params.append('hotel_id', hotelId);
    if (status) params.append('status', status);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get<ApiResponse<Reservation[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Reservation>>(`/reservations/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Reservation>) => {
    const response = await api.post<ApiResponse<Reservation>>('/reservations', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Reservation>) => {
    const response = await api.put<ApiResponse<Reservation>>(`/reservations/${id}`, data);
    return response.data;
  },
  
  updateStatus: async (id: string, status: Reservation['status']) => {
    const response = await api.patch<ApiResponse<Reservation>>(`/reservations/${id}/status`, { status });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/reservations/${id}`);
    return response.data;
  }
};
