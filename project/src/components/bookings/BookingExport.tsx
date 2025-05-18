import React from 'react';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Button } from '../ui/Button';

type Booking = {
  id: string;
  customerName: string;
  status: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
};

type BookingExportProps = {
  bookings: Booking[];
  isFiltered: boolean;
};

export const BookingExport: React.FC<BookingExportProps> = ({ bookings, isFiltered }) => {
  const exportToCSV = () => {
    const csvContent = bookings.map((booking) => ({
      'Booking ID': booking.id,
      'Customer Name': booking.customerName,
      'Status': booking.status,
      'Service Type': booking.serviceType,
      'Start Date': booking.startDate,
      'End Date': booking.endDate,
      'Payment Status': booking.paymentStatus,
      'Created At': booking.createdAt,
      'Updated At': booking.updatedAt,
    }));

    const ws = XLSX.utils.json_to_sheet(csvContent);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Bookings');
    XLSX.writeFile(wb, `bookings${isFiltered ? '_filtered' : ''}.xlsx`);
  };

  return (
    <div className="flex justify-end space-x-2 mb-4">
      <Button
        onClick={exportToCSV}
        variant="outline"
        className="flex items-center"
      >
        <Download className="w-4 h-4 mr-2" />
        Export to Excel
      </Button>
    </div>
  );
};