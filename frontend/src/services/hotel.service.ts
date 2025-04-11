import api from '../lib/api';
import { ApiResponse, Hotel } from '../types';

export const hotelService = {
  getAll: async () => {
    const response = await api.get<ApiResponse<Hotel[]>>('/hotels');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Hotel>>(`/hotels/${id}`);
    return response.data;
  },
  
  create: async (data: FormData) => {
    const response = await api.post<ApiResponse<Hotel>>('/hotels', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  update: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Hotel>>(`/hotels/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/hotels/${id}`);
    return response.data;
  }
};
