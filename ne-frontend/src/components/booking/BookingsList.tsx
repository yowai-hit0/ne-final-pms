import React, { useState } from 'react';
import { Calendar, CheckSquare, Clock, Car } from 'lucide-react';
import { Booking } from '../../types';
import { Card, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import Alert from '../ui/Alert';

interface BookingsListProps {
  bookings: Booking[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onReleaseBooking: (bookingId: string) => Promise<void>;
  activeFilter: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  onFilterChange: (filter: 'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED') => void;
}

export const BookingsList: React.FC<BookingsListProps> = ({
  bookings,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onReleaseBooking,
  activeFilter,
  onFilterChange,
}) => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  const handleReleaseBooking = async (bookingId: string) => {
    setActionInProgress(bookingId);
    setActionError(null);
    
    try {
      await onReleaseBooking(bookingId);
    } catch (error: any) {
      setActionError(error.response?.data?.message || 'Failed to release booking. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };
  
  const calculateDuration = (startTime: string, endTime: string | null) => {
    if (!endTime) return 'Ongoing';
    
    const start = new Date(startTime).getTime();
    const end = new Date(endTime).getTime();
    const diffMs = end - start;
    
    // Convert to hours and minutes
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours === 0) {
      return `${minutes} minutes`;
    } else if (minutes === 0) {
      return `${hours} hours`;
    } else {
      return `${hours} hours, ${minutes} minutes`;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <Alert variant="error" title="Failed to load bookings">
        {error}
      </Alert>
    );
  }
  
  return (
    <div>
      {actionError && (
        <Alert 
          variant="error" 
          title="Action Failed" 
          onClose={() => setActionError(null)}
          className="mb-4"
        >
          {actionError}
        </Alert>
      )}
      
      {/* Filter tabs */}
      <div className="mb-6 flex border-b border-gray-200">
        <button
          onClick={() => onFilterChange('ALL')}
          className={`px-4 py-2 text-sm font-medium ${
            activeFilter === 'ALL'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          All
        </button>
        <button
          onClick={() => onFilterChange('ACTIVE')}
          className={`px-4 py-2 text-sm font-medium ${
            activeFilter === 'ACTIVE'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Active
        </button>
        <button
          onClick={() => onFilterChange('COMPLETED')}
          className={`px-4 py-2 text-sm font-medium ${
            activeFilter === 'COMPLETED'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => onFilterChange('CANCELLED')}
          className={`px-4 py-2 text-sm font-medium ${
            activeFilter === 'CANCELLED'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Cancelled
        </button>
      </div>
      
      {bookings.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No bookings found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {activeFilter === 'ALL'
              ? "You haven't made any bookings yet."
              : `You don't have any ${activeFilter.toLowerCase()} bookings.`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardBody>
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <div className="mr-3">
                        <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                          <Car className="h-6 w-6" />
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center">
                          <h3 className="text-lg font-medium text-gray-900">
                            Spot {booking.spot.spotNumber}
                          </h3>
                          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap text-sm text-gray-500">
                          <div className="flex items-center mt-1 sm:mt-0 mr-4">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>Started: {formatTimestamp(booking.startTime)}</span>
                          </div>
                          
                          {booking.endTime && (
                            <div className="flex items-center mt-1 sm:mt-0 mr-4">
                              <CheckSquare className="h-4 w-4 mr-1" />
                              <span>Ended: {formatTimestamp(booking.endTime)}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center mt-1 sm:mt-0">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>
                              Duration: {booking.endTime 
                                ? calculateDuration(booking.startTime, booking.endTime)
                                : 'Ongoing'
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4">
                    {booking.status === 'ACTIVE' && (
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => handleReleaseBooking(booking.id)}
                        isLoading={actionInProgress === booking.id}
                        disabled={actionInProgress === booking.id}
                      >
                        Release Spot
                      </Button>
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      )}
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </div>
  );
};