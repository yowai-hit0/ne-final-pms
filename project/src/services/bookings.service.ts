import api from './api';
import { BookingFilters, Booking, PaginatedResponse } from '../types';

export const BookingsService = {
  async getBookings(filters: BookingFilters = {}): Promise<PaginatedResponse<Booking>> {
    const { status, page = 1, limit = 10 } = filters;
    let url = `/bookings?page=${page}&limit=${limit}`;
    
    if (status) {
      url += `&status=${status}`;
    }
    
    const response = await api.get(url);
    return response.data;
  },
  
  async createBooking(spotId: string): Promise<Booking> {
    const response = await api.post('/bookings', { spotId });
    return response.data;
  },
  
  async releaseBooking(bookingId: string): Promise<{ message: string }> {
    const response = await api.put('/bookings/release', { bookingId });
    return response.data;
  },
};

export default BookingsService;