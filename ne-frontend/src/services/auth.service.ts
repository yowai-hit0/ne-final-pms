import api from './api';
import { LoginCredentials, RegisterData, User, VerificationData } from '../types';

export const AuthService = {
  async register(data: RegisterData): Promise<{ message: string }> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  
  async login(credentials: LoginCredentials): Promise<{ token: string; user: User }> {
    const response = await api.post('/auth/login', credentials);
    console.log(response.data);
    localStorage.setItem('token', response.data.accessToken);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    return response.data;
  },
  
  async verifyEmail(data: VerificationData): Promise<{ message: string }> {
    const response = await api.post('/auth/activate', data);
    return response.data;
  },
  
  async requestOtp(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/request-otp', { email });
    return response.data;
  },
  
  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data.user;
  },
  
  async logout(): Promise<void> {
    await api.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  async resetPassword(email: string, code: string, newPassword: string): Promise<{ message: string }> {
    const response = await api.post('/auth/reset-password', {
      email,
      code,
      newPassword,
    });
    return response.data;
  },
  
  getStoredUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
  
  getToken(): string | null {
    return localStorage.getItem('token');
  },
};

export default AuthService;