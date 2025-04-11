import api from '../lib/api';
import { ApiResponse, Availability } from '../types';

export const availabilityService = {
  getAll: async (roomId?: string, startDate?: string, endDate?: string) => {
    let url = '/availability';
    const params = new URLSearchParams();
    
    if (roomId) params.append('room_id', roomId);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await api.get<ApiResponse<Availability[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<Availability>>(`/availability/${id}`);
    return response.data;
  },
  
  create: async (data: Partial<Availability>) => {
    const response = await api.post<ApiResponse<Availability>>('/availability', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Availability>) => {
    const response = await api.put<ApiResponse<Availability>>(`/availability/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/availability/${id}`);
    return response.data;
  },
  
  bulkUpload: async (roomId: string, file: File) => {
    const formData = new FormData();
    formData.append('room_id', roomId);
    formData.append('file', file);
    
    const response = await api.post<ApiResponse<{ inserted: number; updated: number }>>('/availability/bulk-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }
};
