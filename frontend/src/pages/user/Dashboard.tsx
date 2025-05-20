import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Car, Clock, DollarSign, Ticket } from 'lucide-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useAuthStore } from '../../store/authStore';
import { getAvailableParkings } from '../../services/parkingService';
import { createTicket, getMyTickets } from '../../services/ticketService';
import { Parking, Ticket as TicketType } from '../../types';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [activeTicket, setActiveTicket] = useState<TicketType | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get available parkings
        const parkingsResponse = await getAvailableParkings({ page: 1, limit: 10 });
        setParkings(parkingsResponse.data.parkings);
        
        // Get user's active tickets
        const ticketsResponse = await getMyTickets({ page: 1, limit: 5 });
        
        // Find if user has an active ticket (no exitTime)
        const activeTicket = ticketsResponse.data.tickets.find(ticket => !ticket.exitTime);
        if (activeTicket) {
          setActiveTicket(activeTicket);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateTicket = async (parkingId: string) => {
    try {
      setActionLoading(true);
      setError(null);
      
      const response = await createTicket(parkingId);
      
      if (response.status === 'success') {
        setActiveTicket(response.data);
        setSuccess('Check-in successful! Your parking ticket has been created.');
        
        // Update available parkings
        const parkingsResponse = await getAvailableParkings({ page: 1, limit: 10 });
        setParkings(parkingsResponse.data.parkings);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create parking ticket');
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="mt-2 text-gray-600">
          Find and book your parking space with ease.
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

      {/* Active Ticket Section */}
      {activeTicket && (
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Active Parking</h2>
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <div className="flex flex-col md:flex-row justify-between">
              <div>
                <div className="flex items-center mb-4">
                  <Ticket className="h-6 w-6 mr-2" />
                  <h3 className="text-lg font-semibold">Parking Ticket #{activeTicket.id.substring(0, 8)}</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-blue-100 text-sm">Location</p>
                    <p className="font-medium">{activeTicket.parking?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Check-in Time</p>
                    <p className="font-medium">
                      {format(new Date(activeTicket.entryTime), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Vehicle</p>
                    <p className="font-medium">{user?.vehiclePlateNumber || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="text-blue-100 text-sm">Rate</p>
                    <p className="font-medium">
                      {formatCurrency(activeTicket.parking?.chargingFeePerHour || 0)}/hour
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-end justify-end">
                <Link to="/my-tickets">
                  <Button variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Available Parkings Section */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Available Parking Locations</h2>
        
        {parkings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-6 text-center">
            <p className="text-gray-500">No available parking locations at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {parkings.map((parking) => (
              <Card key={parking.id} className="h-full transition-all duration-300 hover:shadow-lg">
                <div className="flex flex-col h-full">
                  <div className="flex items-center mb-4">
                    <Car className="h-5 w-5 text-blue-500 mr-2" />
                    <h3 className="font-semibold text-gray-900">{parking.name}</h3>
                  </div>
                  
                  <div className="mb-4 flex-grow">
                    <p className="text-gray-600 text-sm mb-3">{parking.address}</p>
                    
                    <div className="grid grid-cols-2 gap-y-2">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {formatCurrency(parking.chargingFeePerHour)}/hour
                        </span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          Code: {parking.code}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex justify-between items-center">
                    <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm">
                      {parking.numberOfAvailableSpace} spaces available
                    </div>
                    
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleCreateTicket(parking.id)}
                      disabled={!!activeTicket || actionLoading}
                      isLoading={actionLoading}
                    >
                      Check In
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;