import api from '../lib/api';
import { ApiResponse, RatePlan } from '../types';

export const rateplanService = {
  getAll: async (roomId?: string) => {
    const url = roomId ? `/rateplans/room/${roomId}` : '/rateplans';
    const response = await api.get<ApiResponse<RatePlan[]>>(url);
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await api.get<ApiResponse<RatePlan>>(`/rateplans/${id}`);
    return response.data;
  },
  
  getApplicable: async (roomId: string, checkIn: string, checkOut?: string, jumlahMalam?: number) => {
    let url = `/rateplans/applicable?room_id=${roomId}&check_in=${checkIn}`;
    
    if (checkOut) url += `&check_out=${checkOut}`;
    if (jumlahMalam) url += `&jumlah_malam=${jumlahMalam}`;
    
    const response = await api.get<ApiResponse<RatePlan[]>>(url);
    return response.data;
  },
  
  create: async (data: Partial<RatePlan>) => {
    const response = await api.post<ApiResponse<RatePlan>>('/rateplans', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<RatePlan>) => {
    const response = await api.put<ApiResponse<RatePlan>>(`/rateplans/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete<ApiResponse<null>>(`/rateplans/${id}`);
    return response.data;
  }
};
