import React, { useState, useEffect } from 'react';
import { Car, Clock, MapPin, History } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ParkingSpotsList from '../../components/parking/ParkingSpotsList';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { SpotsService } from '../../services/spots.service';
import { BookingsService } from '../../services/bookings.service';
import { ParkingSpot, SpotFilters } from '../../types';
import { useNavigate } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { user } = authState;
  
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);
  const [spotsError, setSpotsError] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const fetchAvailableSpots = async (page = 1) => {
    setIsLoadingSpots(true);
    setSpotsError(null);
    
    try {
      const filters: SpotFilters = {
        page,
        limit: 6, // Show 6 spots per page
      };
      
      const response = await SpotsService.getAvailableSpots(filters);
      setSpots(response.data);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.totalPages);
    } catch (error: any) {
      setSpotsError(error.response?.data?.message || 'Failed to load available parking spots');
    } finally {
      setIsLoadingSpots(false);
    }
  };
  
  useEffect(() => {
    fetchAvailableSpots();
  }, []);
  
  const handleBookSpot = async (spotId: string) => {
    try {
      await BookingsService.createBooking(spotId);
      setBookingSuccess('Spot booked successfully!');
      
      // Refresh available spots
      fetchAvailableSpots(currentPage);
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(null);
      }, 3000);
    } catch (error: any) {
      throw error;
    }
  };
  
  const handlePageChange = (page: number) => {
    fetchAvailableSpots(page);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.firstName}!</h1>
            <p className="mt-2 text-gray-600">
              Find and book available parking spots for your vehicle ({user?.vehiclePlateNumber}).
            </p>
          </div>
          
          {bookingSuccess && (
            <Alert 
              variant="success"
              title="Booking Successful"
              onClose={() => setBookingSuccess(null)}
              className="mb-6"
            >
              {bookingSuccess}
            </Alert>
          )}
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-100">Available Spots</p>
                    <h3 className="text-2xl font-bold">
                      {isLoadingSpots ? '...' : spots.length}
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100">Current Time</p>
                    <h3 className="text-2xl font-bold">
                      {new Date().toLocaleTimeString()}
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <History className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-amber-100">My Bookings</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-1 bg-white/10 border-white/30 text-white hover:bg-white/20"
                      onClick={() => navigate('/bookings')}
                    >
                      View History
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
          
          {/* Available Spots */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Available Parking Spots</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchAvailableSpots(currentPage)}
                >
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardBody>
              <ParkingSpotsList
                spots={spots}
                isLoading={isLoadingSpots}
                error={spotsError}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                onBookSpot={handleBookSpot}
              />
            </CardBody>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default UserDashboard;