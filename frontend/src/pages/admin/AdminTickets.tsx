import React, { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Check, Search } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Alert from '../../components/ui/Alert';
import Pagination from '../../components/ui/Pagination';
import Badge from '../../components/ui/Badge';
import Input from '../../components/ui/Input';
import { getAllTickets, checkoutTicket } from '../../services/ticketService';
import { PaginationParams, Ticket } from '../../types';

const AdminTickets: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [meta, setMeta] = useState({
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
      const response = await getAllTickets(params);
      
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

  if (loading && tickets.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">All Parking Tickets</h1>
        <p className="mt-2 text-gray-600">
          View and manage all user parking tickets
        </p>
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

      {/* Search and filter section - future enhancement */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by user or location..."
            className="flex-1"
            icon={<Search className="h-5 w-5 text-gray-400" />}
          />
          <Button variant="primary">
            Search
          </Button>
        </div>
      </Card>

      {/* Tickets Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Exit Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No tickets found
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.user?.firstName} {ticket.user?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ticket.user?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {ticket.parking?.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {ticket.parking?.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(parseISO(ticket.entryTime), 'MMM d, yyyy h:mm a')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {ticket.exitTime 
                        ? format(parseISO(ticket.exitTime), 'MMM d, yyyy h:mm a')
                        : '—'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {ticket.exitTime 
                        ? <span className="text-green-600 font-medium">{formatCurrency(ticket.chargedAmount)}</span>
                        : <span className="text-gray-400">Pending</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge 
                        variant={ticket.exitTime ? 'success' : 'warning'}
                      >
                        {ticket.exitTime ? 'Completed' : 'Active'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!ticket.exitTime && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCheckout(ticket.id)}
                          isLoading={actionLoading}
                          icon={<Check className="h-4 w-4" />}
                        >
                          Checkout
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6">
        <Pagination
          currentPage={meta.page}
          totalPages={meta.lastPage}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminTickets;