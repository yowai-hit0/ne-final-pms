import { apiRequest } from './api';
import { PaginationParams, Parking, ParkingResponse, ParkingsResponse } from '../types';

export const getAllParkings = async (params: PaginationParams): Promise<ParkingsResponse> => {
  return apiRequest<ParkingsResponse>({
    method: 'GET',
    url: '/parkings',
    params,
  });
};

export const getAvailableParkings = async (params: PaginationParams): Promise<ParkingsResponse> => {
  return apiRequest<ParkingsResponse>({
    method: 'GET',
    url: '/parkings/available',
    params,
  });
};

export const createParking = async (data: Omit<Parking, 'id' | 'createdAt' | 'updatedAt'>): Promise<ParkingResponse> => {
  return apiRequest<ParkingResponse>({
    method: 'POST',
    url: '/parkings',
    data,
  });
};

export const updateParking = async (id: string, data: Partial<Parking>): Promise<ParkingResponse> => {
  return apiRequest<ParkingResponse>({
    method: 'PUT',
    url: `/parkings/${id}`,
    data,
  });
};

export const deleteParking = async (id: string): Promise<{ status: string; message: string; data: null }> => {
  return apiRequest({
    method: 'DELETE',
    url: `/parkings/${id}`,
  });
};