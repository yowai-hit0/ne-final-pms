import api from './api';
import { LoginCredentials, RegisterData, User, VerificationData } from '../types';

export const AuthService = {
  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await api.post('/auth/register', data);
    return response.data.data;
  },
  
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', credentials);
    const { accessToken, user } = response.data.data;
    
    // Store authentication data
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    return { token: accessToken, user };
  },
  
  async verifyEmail(data: VerificationData): Promise<{ message: string }> {
    const response = await api.post('/auth/verify', data);
    return response.data.data;
  },
  
  async requestOtp(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/request-otp', { email });
    return response.data.data;
  },
  
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.data.user;
  },
  
  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
    } finally {
      // Always clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },
  
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data.data;
  },
  
  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data.data;
  },
  
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },
  
  isAuthenticated(): boolean {
    return !!this.getToken();
  },
  
  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

export default AuthService;