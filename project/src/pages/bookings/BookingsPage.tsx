import React, { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import BookingsList from '../../components/booking/BookingsList';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import { useAuth } from '../../context/AuthContext';
import { BookingsService } from '../../services/bookings.service';
import { Booking, BookingFilters } from '../../types';

const BookingsPage: React.FC = () => {
  const { state: authState } = useAuth();
  const { user } = authState;
  
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');
  
  const fetchBookings = async (page = 1, filter?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const filters: BookingFilters = {
        page,
        limit: 10,
      };
      
      if (filter && filter !== 'ALL') {
        filters.status = filter;
      }
      
      const response = await BookingsService.getBookings(filters);
      setBookings(response.data);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchBookings(1, activeFilter === 'ALL' ? undefined : activeFilter);
  }, [activeFilter]);
  
  const handleReleaseBooking = async (bookingId: string) => {
    try {
      await BookingsService.releaseBooking(bookingId);
      // Refresh bookings list
      fetchBookings(currentPage, activeFilter === 'ALL' ? undefined : activeFilter);
    } catch (error: any) {
      throw error;
    }
  };
  
  const handlePageChange = (page: number) => {
    fetchBookings(page, activeFilter === 'ALL' ? undefined : activeFilter);
  };
  
  const handleFilterChange = (filter: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => {
    setActiveFilter(filter);
    // Reset to first page when changing filters
    setCurrentPage(1);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="mt-2 text-gray-600">
              {user?.role === 'ADMIN' 
                ? 'View and manage all parking spot bookings in the system.'
                : 'View and manage your parking spot bookings.'}
            </p>
          </div>
          
          {/* Bookings list */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900">Booking History</h2>
            </CardHeader>
            <CardBody>
              <BookingsList
                bookings={bookings}
                isLoading={isLoading}
                error={error}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onReleaseBooking={handleReleaseBooking}
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </CardBody>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingsPage;