import api from '../lib/api';
import { ApiResponse, Room } from '../types';

export const roomService = {
  getAll: async (hotelId?: string) => {
    const url = hotelId ? `/rooms?hotel_id=${hotelId}` : '/rooms';
    const response = await api.get<ApiResponse<Room[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Room>>(`/rooms/${id}`);
    return response.data;
  },
  
  create: async (data: FormData) => {
    const response = await api.post<ApiResponse<Room>>('/rooms', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  update: async (id: string, data: FormData) => {
    const response = await api.put<ApiResponse<Room>>(`/rooms/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/rooms/${id}`);
    return response.data;
  }
};
