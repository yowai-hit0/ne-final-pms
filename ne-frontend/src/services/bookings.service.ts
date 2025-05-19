import api from './api';
import { BookingFilters, ApiResponse, BookingResponse, Booking } from '../types';

export const BookingsService = {
  async getBookings(filters: BookingFilters = {}): Promise<ApiResponse<BookingResponse>> {
    const { status, page = 1, limit = 10, startDate, endDate, customerName, bookingId } = filters;
    let url = `/bookings?page=${page}&limit=${limit}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    if (startDate) {
      url += `&startDate=${startDate}`;
    }
    if (endDate) {
      url += `&endDate=${endDate}`;
    }
    if (customerName) {
      url += `&customerName=${encodeURIComponent(customerName)}`;
    }
    if (bookingId) {
      url += `&bookingId=${bookingId}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  async createBooking(spotId: string): Promise<ApiResponse<Booking>> {
    const response = await api.post('/bookings', { spotId });
    return response.data;
  },
  
  async releaseBooking(bookingId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await api.post(`/bookings/${bookingId}/release`);
    return response.data;
  },
};

export default BookingsService;