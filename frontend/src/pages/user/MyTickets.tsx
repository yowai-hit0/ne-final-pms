/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import { format, parseISO, differenceInHours, differenceInMinutes } from 'date-fns';
import { AlertTriangle, Check, Clock, DollarSign } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import Alert from '../../components/ui/Alert';
import Badge from '../../components/ui/Badge';
import { checkoutTicket, getMyTickets } from '../../services/ticketService';
import { Ticket, PaginationParams } from '../../types';

const MyTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState<{
    page: number;
    limit: number;
    total: number;
    lastPage: number;
  }>({
    page: 1,
    limit: 10,
    total: 0,
    lastPage: 1,
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchTickets = async (params: PaginationParams) => {
    try {
      setLoading(true);
      const response = await getMyTickets(params);
      
      if (response.status === 'success') {
        setTickets(response.data.tickets);
        setMeta(response.data.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets({ page: 1, limit: 10 });
  }, []);

  const handlePageChange = (page: number) => {
    fetchTickets({ page, limit: meta.limit });
  };

  const handleCheckout = async (ticketId: string) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await checkoutTicket(ticketId);
      
      if (response.status === 'success') {
        setSuccess('Checkout successful!');
        
        // Update the ticket in the list
        setTickets(tickets.map(t => 
          t.id === ticketId ? response.data : t
        ));
      }
    } catch (err: any) {
      setError(err.message || 'Failed to checkout');
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const calculateDuration = (entryTime: string, exitTime: string | null) => {
    if (!exitTime) {
      // Calculate duration until now for active tickets
      const entry = parseISO(entryTime);
      const now = new Date();
      
      const hours = differenceInHours(now, entry);
      const minutes = differenceInMinutes(now, entry) % 60;
      
      return `${hours}h ${minutes}m (ongoing)`;
    } else {
      // Calculate duration for completed tickets
      const entry = parseISO(entryTime);
      const exit = parseISO(exitTime);
      
      const hours = differenceInHours(exit, entry);
      const minutes = differenceInMinutes(exit, entry) % 60;
      
      return `${hours}h ${minutes}m`;
    }
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Parking Tickets</h1>
          <p className="mt-2 text-gray-600">
            View and manage your parking history
          </p>
        </div>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          onClose={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
          className="mb-6"
        />
      )}

      {tickets.length === 0 ? (
        <Card className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets found</h3>
          <p className="text-gray-500">You haven't created any parking tickets yet.</p>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Card key={ticket.id} className="transition-all duration-200 hover:shadow-md">
                <div className="flex flex-col md:flex-row justify-between">
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between mb-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {ticket.parking?.name}
                      </h3>
                      <Badge 
                        variant={ticket.exitTime ? 'success' : 'warning'}
                        className="ml-2"
                      >
                        {ticket.exitTime ? 'Completed' : 'Active'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Check In</p>
                        <p className="text-sm">
                          {format(parseISO(ticket.entryTime), 'MMM d, yyyy h:mm a')}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Check Out</p>
                        <p className="text-sm">
                          {ticket.exitTime 
                            ? format(parseISO(ticket.exitTime), 'MMM d, yyyy h:mm a')
                            : '—'
                          }
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Duration</p>
                        <p className="text-sm flex items-center">
                          <Clock className="h-3 w-3 mr-1 text-gray-400" />
                          {calculateDuration(ticket.entryTime, ticket.exitTime)}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Location</p>
                        <p className="text-sm">{ticket.parking?.address || '—'}</p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Rate</p>
                        <p className="text-sm flex items-center">
                          <DollarSign className="h-3 w-3 mr-1 text-gray-400" />
                          {formatCurrency(ticket.parking?.chargingFeePerHour || 0)}/hour
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs text-gray-500">Total Charge</p>
                        <p className={`text-sm font-medium ${ticket.exitTime ? 'text-green-600' : 'text-gray-400'}`}>
                          {ticket.exitTime 
                            ? formatCurrency(ticket.chargedAmount) 
                            : 'Pending'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {!ticket.exitTime && (
                    <div className="mt-4 md:mt-0 md:ml-4 flex md:items-center">
                      <Button
                        variant="outline"
                        onClick={() => handleCheckout(ticket.id)}
                        isLoading={actionLoading}
                        icon={<Check className="h-4 w-4" />}
                      >
                        Check Out
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
          
          <div className="mt-8">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.lastPage}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MyTickets;