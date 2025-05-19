import React from 'react';
import { useForm } from 'react-hook-form';
import { Search, X } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export type BookingSearchFilters = {
  bookingId: string;
  customerName: string;
  startDate: string;
  endDate: string;
  status: string;
  serviceType: string;
};

type BookingSearchProps = {
  onSearch: (filters: BookingSearchFilters) => void;
  onClear: () => void;
};

export const BookingSearch: React.FC<BookingSearchProps> = ({ onSearch, onClear }) => {
  const { register, handleSubmit, reset } = useForm<BookingSearchFilters>();

  const handleClear = () => {
    reset();
    onClear();
  };

  return (
    <form onSubmit={handleSubmit(onSearch)} className="space-y-4 bg-white p-4 rounded-lg shadow">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Input
          {...register('bookingId')}
          placeholder="Booking ID"
          className="w-full"
        />
        <Input
          {...register('customerName')}
          placeholder="Customer Name"
          className="w-full"
        />
        <Input
          {...register('startDate')}
          type="date"
          placeholder="Start Date"
          className="w-full"
        />
        <Input
          {...register('endDate')}
          type="date"
          placeholder="End Date"
          className="w-full"
        />
        <select
          {...register('status')}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select
          {...register('serviceType')}
          className="w-full rounded-md border border-gray-300 px-3 py-2"
        >
          <option value="">Select Service Type</option>
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          onClick={handleClear}
          variant="outline"
          className="flex items-center"
        >
          <X className="w-4 h-4 mr-2" />
          Clear Filters
        </Button>
        <Button type="submit" className="flex items-center">
          <Search className="w-4 h-4 mr-2" />
          Search
        </Button>
      </div>
    </form>
  );
};