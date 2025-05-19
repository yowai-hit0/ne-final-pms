import React, { useState, useEffect } from 'react';
import { Car, Database, Users, BookOpen } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import ParkingSpotsList from '../../components/parking/ParkingSpotsList';
import SpotCreationForm from '../../components/parking/SpotCreationForm';
import { Card, CardHeader, CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { useAuth } from '../../context/AuthContext';
import { SpotsService } from '../../services/spots.service';
import { BookingsService } from '../../services/bookings.service';
import { ParkingSpot, SpotFilters, Booking, BookingFilters } from '../../types';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const { user } = authState;
  
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [isLoadingSpots, setIsLoadingSpots] = useState(true);
  const [spotsError, setSpotsError] = useState<string | null>(null);
  
  const [activeBookings, setActiveBookings] = useState<number>(0);
  const [totalSpots, setTotalSpots] = useState<number>(0);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  useEffect(() => {
    // Fetch all spots and active bookings
    fetchSpots();
    fetchActiveBookingsCount();
  }, []);
  
  const fetchSpots = async (page = 1) => {
    setIsLoadingSpots(true);
    setSpotsError(null);
    
    try {
      const filters: SpotFilters = {
        page,
        limit: 6, // Show 6 spots per page
      };
      
      const response = await SpotsService.getAllSpots(filters);
      setSpots(response.data);
      setCurrentPage(response.meta.currentPage);
      setTotalPages(response.meta.totalPages);
      setTotalSpots(response.meta.totalItems);
    } catch (error: any) {
      setSpotsError(error.response?.data?.message || 'Failed to load parking spots');
    } finally {
      setIsLoadingSpots(false);
    }
  };
  
  const fetchActiveBookingsCount = async () => {
    try {
      const filters: BookingFilters = {
        status: 'ACTIVE',
        limit: 1, // We only need the count from meta
      };
      
      const response = await BookingsService.getBookings(filters);
      setActiveBookings(response.meta.totalItems);
    } catch (error) {
      console.error('Failed to fetch active bookings count', error);
    }
  };
  
  const handleCreateSpot = async (spotNumber: string) => {
    try {
      await SpotsService.createSpot(spotNumber);
      // Refresh spots after creation
      fetchSpots(currentPage);
    } catch (error: any) {
      throw error;
    }
  };
  
  const handleGenerateSpots = async (prefix: string, count: number) => {
    try {
      await SpotsService.generateSpots(prefix, count);
      // Refresh spots after generation
      fetchSpots(1); // Go to first page after bulk generation
    } catch (error: any) {
      throw error;
    }
  };
  
  const handleDeleteSpot = async (spotId: string) => {
    try {
      await SpotsService.deleteSpot(spotId);
      // Refresh spots after deletion
      fetchSpots(currentPage);
    } catch (error: any) {
      throw error;
    }
  };
  
  const handlePageChange = (page: number) => {
    fetchSpots(page);
  };
  
  const occupancyRate = totalSpots > 0 ? ((activeBookings / totalSpots) * 100).toFixed(1) : 0;
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-10 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage parking spots and monitor system activity.
            </p>
          </div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-100">Total Spots</p>
                    <h3 className="text-2xl font-bold">{totalSpots}</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-blue-100">Occupancy Rate</span>
                    <span className="text-xs text-blue-100">{occupancyRate}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white h-2 rounded-full"
                      style={{ width: `${occupancyRate}%` }}
                    ></div>
                  </div>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white">
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-teal-100">Active Bookings</p>
                    <h3 className="text-2xl font-bold">{activeBookings}</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20"
                    onClick={() => navigate('/bookings')}
                  >
                    View All Bookings
                  </Button>
                </div>
              </CardBody>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardBody className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-white/20 mr-4">
                    <Database className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-purple-100">System Status</p>
                    <div className="flex items-center mt-1">
                      <div className="h-3 w-3 rounded-full bg-green-400 mr-2"></div>
                      <span className="font-medium">Operational</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-purple-100">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </CardBody>
            </Card>
          </div>
          
          {/* Spot Creation Form */}
          <SpotCreationForm
            onCreateSpot={handleCreateSpot}
            onGenerateSpots={handleGenerateSpots}
          />
          
          {/* All Spots List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">All Parking Spots</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => fetchSpots(currentPage)}
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
                onDeleteSpot={handleDeleteSpot}
                isAdmin={true}
              />
            </CardBody>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;