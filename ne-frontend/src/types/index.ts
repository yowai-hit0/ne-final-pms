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

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface BookingUser {
  user_id: string;
  email: string;
  name: string;
  vehicle_plate_number: string;
}

export interface BookingSpot {
  id: string;
  spotNumber: string;
}

export interface Booking {
  id: string;
  user: BookingUser;
  spot: BookingSpot;
  entry_time: string;
  exit_time: string | null;
  status: 'ongoing' | 'completed' | 'cancelled';
}

export interface BookingResponse {
  booking_response: Booking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    lastPage: number;
  };
}

export interface BookingFilters {
  status?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  customerName?: string;
  bookingId?: string;
}

export interface SpotFilters {
  page?: number;
  limit?: number;
}