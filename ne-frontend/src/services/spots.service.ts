import api from './api';
import { ApiResponse, ParkingSpotsResponse, ParkingSpot, SpotFilters } from '../types';

export const SpotsService = {
  async getAllSpots(filters: SpotFilters = {}): Promise<ApiResponse<ParkingSpotsResponse>> {
    try {
      const { page = 1, limit = 10 } = filters;
      const response = await api.get(`/spots?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async getAvailableSpots(filters: SpotFilters = {}): Promise<ApiResponse<ParkingSpotsResponse>> {
    try {
      const { page = 1, limit = 10 } = filters;
      const response = await api.get(`/spots/available?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  async createSpot(spotNumber: string): Promise<ApiResponse<ParkingSpot>> {
    const response = await api.post('/spots', { spotNumber });
    return response.data;
  },
  
  async generateSpots(prefix: string, count: number): Promise<ApiResponse<{ message: string; count: number }>> {
    const response = await api.post('/spots/generate', { prefix, count });
    return response.data;
  },
  
  async deleteSpot(id: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.delete(`/spots/${id}`);
    return response.data;
  },
};

export default SpotsService;