import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookingSearch, type BookingSearchFilters } from '../../components/bookings/BookingSearch';
import { BookingExport } from '../../components/bookings/BookingExport';
import { BookingsList } from '../../components/booking/BookingsList';

export const BookingsPage: React.FC = () => {
  const [filters, setFilters] = useState<BookingSearchFilters | null>(null);

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ['bookings', filters],
    queryFn: async () => {
      // Implement your API call here using the filters
      const response = await fetch('/api/bookings', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filters),
      });
      if (!response.ok) throw new Error('Failed to fetch bookings');
      return response.json();
    },
  });

  const handleSearch = (newFilters: BookingSearchFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(null);
  };

  if (error) {
    return <div className="text-red-500">Error loading bookings</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Bookings</h1>
      
      <BookingSearch onSearch={handleSearch} onClear={handleClearFilters} />
      
      <div className="mt-6">
        <BookingExport
          bookings={bookings || []}
          isFiltered={!!filters}
        />
        
        {isLoading ? (
          <div className="text-center py-8">Loading bookings...</div>
        ) : (
          <BookingsList bookings={bookings || []} />
        )}
      </div>
    </div>
  );
};

export default BookingsPage;