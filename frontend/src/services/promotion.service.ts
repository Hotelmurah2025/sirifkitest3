import api from '../lib/api';
import { ApiResponse, Promotion } from '../types';

export const promotionService = {
  getAll: async (hotelId?: string) => {
    let url = '/promotions';
    if (hotelId) {
      url += `?hotel_id=${hotelId}`;
    }
    
    const response = await api.get<ApiResponse<Promotion[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Promotion>>(`/promotions/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Promotion>) => {
    const response = await api.post<ApiResponse<Promotion>>('/promotions', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Promotion>) => {
    const response = await api.put<ApiResponse<Promotion>>(`/promotions/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/promotions/${id}`);
    return response.data;
  }
};
