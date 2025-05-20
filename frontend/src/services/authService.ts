/* eslint-disable @typescript-eslint/no-unused-vars */
import { apiRequest } from './api';
import { AuthResponse, ProfileResponse, User } from '../types';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  vehiclePlateNumber?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  return apiRequest<AuthResponse>({
    method: 'POST',
    url: '/auth/register',
    data,
  });
};

export const login = async (data: LoginData): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>({
    method: 'POST',
    url: '/auth/login',
    data,
  });
  
  if (response.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
    
    // Store user info
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
  }
  
  return response;
};

export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await apiRequest<AuthResponse>({
    method: 'POST',
    url: '/auth/refresh-token',
  });
  
  if (response.data?.accessToken) {
    localStorage.setItem('accessToken', response.data.accessToken);
  }
  
  return response;
};

export const logout = async (): Promise<void> => {
  try {
    await apiRequest({
      method: 'POST',
      url: '/auth/logout',
    });
  } finally {
    // Always clear local storage, even if the API call fails
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }
};

export const getProfile = async (): Promise<User> => {
  try {
    const response = await apiRequest<ProfileResponse>({
      method: 'GET',
      url: '/auth/profile',
    });
    
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
      return response.data;
    }
    
    throw new Error('Failed to get user profile');
  } catch (error) {
    localStorage.removeItem('user');
    throw error;
  }
};

export const getCurrentUser = (): User | null => {
  try {
    const userJson = localStorage.getItem('user');
    if (!userJson) return null;
    
    const user = JSON.parse(userJson);
    if (!user || typeof user !== 'object') return null;
    
    return user as User;
  } catch (error) {
    // If there's any error parsing the JSON, clear the invalid data
    localStorage.removeItem('user');
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('accessToken') && !!getCurrentUser();
};

export const hasRole = (role: string): boolean => {
  const user = getCurrentUser();
  return !!user && user.role === role;
};

export const isAdmin = (): boolean => {
  return hasRole('ADMIN');
};