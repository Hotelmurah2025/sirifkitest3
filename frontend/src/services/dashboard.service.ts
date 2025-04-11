import api from '../lib/api';
import { ApiResponse, DashboardStats } from '../types';

export const dashboardService = {
  getStats: async (hotelId?: string) => {
    let url = '/dashboard/stats';
    if (hotelId) {
      url += `?hotel_id=${hotelId}`;
    }
    
    const response = await api.get<ApiResponse<DashboardStats>>(url);
    return response.data;
  }
};
