import React, { useState } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BookingsList } from '../../components/booking/BookingsList';
import { BookingsService } from '../../services/bookings.service';
import Alert from '../../components/ui/Alert';
import { BookingSearch, type BookingSearchFilters } from '../../components/bookings/BookingSearch';
import { BookingExport } from '../../components/bookings/BookingExport';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const BookingsPageContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'ongoing' | 'completed' >('ALL');
  const [searchFilters, setSearchFilters] = useState<BookingSearchFilters | null>(null);

  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['bookings', currentPage, activeFilter, searchFilters],
    queryFn: async () => {
      const filters = {
        page: currentPage,
        limit: 10,
        status: activeFilter === 'ALL' ? undefined : activeFilter.toLowerCase(),
        ...searchFilters
      };
      return BookingsService.getBookings(filters);
    }
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (filter: 'ALL' | 'ongoing' | 'completed') => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleSearch = (filters: BookingSearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage(1); // Reset to first page when search filters change
  };

  const handleClearFilters = () => {
    setSearchFilters(null);
    setCurrentPage(1);
  };

  const handleReleaseBooking = async (bookingId: string) => {
    try {
      await BookingsService.releaseBooking(bookingId);
      refetch(); // Refresh the bookings list after releasing
    } catch (error) {
      throw error;
    }
  };

  if (error) {
    return (
      <Alert
        variant="error"
        title="Error Loading Bookings"
      >
        {error instanceof Error ? error.message : 'Failed to load bookings'}
      </Alert>
    );
  }

  const bookings = data?.data?.booking_response || [];
  const totalPages = data?.data?.meta?.lastPage || 1;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Bookings</h1>
        <BookingExport
          bookings={bookings}
          isFiltered={!!searchFilters || activeFilter !== 'ALL'}
        />
      </div>

      <BookingSearch 
        onSearch={handleSearch}
        onClear={handleClearFilters}
      />
      
      <div className="mt-6">
        <BookingsList
          bookings={bookings}
          isLoading={isLoading}
          error={error instanceof Error ? error.message : null}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onReleaseBooking={handleReleaseBooking}
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
        />
      </div>
    </div>
  );
};

const BookingsPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BookingsPageContent />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default BookingsPage;