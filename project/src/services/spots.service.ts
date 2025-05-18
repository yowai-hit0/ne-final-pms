import api from './api';
import { PaginatedResponse, ParkingSpot, SpotFilters } from '../types';

export const SpotsService = {
  async getAllSpots(filters: SpotFilters = {}): Promise<PaginatedResponse<ParkingSpot>> {
    const { page = 1, limit = 10 } = filters;
    const response = await api.get(`/spots?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  async getAvailableSpots(filters: SpotFilters = {}): Promise<PaginatedResponse<ParkingSpot>> {
    const { page = 1, limit = 10 } = filters;
    const response = await api.get(`/spots/available?page=${page}&limit=${limit}`);
    return response.data;
  },
  
  async createSpot(spotNumber: string): Promise<ParkingSpot> {
    const response = await api.post('/spots', { spotNumber });
    return response.data;
  },
  
  async generateSpots(prefix: string, count: number): Promise<{ message: string; count: number }> {
    const response = await api.post('/spots/generate', { prefix, count });
    return response.data;
  },
  
  async deleteSpot(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/spots/${id}`);
    return response.data;
  },
};

export default SpotsService;