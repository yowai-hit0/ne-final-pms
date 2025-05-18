// Type definitions for the Parking Management System

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'ADMIN' | 'USER';
  vehiclePlateNumber?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ParkingSpot {
  id: string;
  spotNumber: string;
  isOccupied: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  userId: string;
  spotId: string;
  spot: ParkingSpot;
  startTime: string;
  endTime: string | null;
  status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  vehiclePlateNumber: string;
}

export interface VerificationData {
  email: string;
  code: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface BookingFilters {
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  page?: number;
  limit?: number;
}

export interface SpotFilters {
  page?: number;
  limit?: number;
}