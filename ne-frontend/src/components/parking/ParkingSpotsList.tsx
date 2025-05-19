import React, { useState } from 'react';
import { Car, Trash2 } from 'lucide-react';
import { ParkingSpot } from '../../types';
import { Card, CardBody } from '../ui/Card';
import Button from '../ui/Button';
import Pagination from '../ui/Pagination';
import Alert from '../ui/Alert';

interface ParkingSpotsListProps {
  spots: ParkingSpot[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onBookSpot?: (spotId: string) => Promise<void>;
  onDeleteSpot?: (spotId: string) => Promise<void>;
  isAdmin?: boolean;
}

const ParkingSpotsList: React.FC<ParkingSpotsListProps> = ({
  spots,
  isLoading,
  error,
  currentPage,
  totalPages,
  onPageChange,
  onBookSpot,
  onDeleteSpot,
  isAdmin = false,
}) => {
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  
  const handleBookSpot = async (spotId: string) => {
    if (!onBookSpot) return;
    
    setActionInProgress(spotId);
    setActionError(null);
    
    try {
      await onBookSpot(spotId);
    } catch (error: any) {
      setActionError(error.response?.data?.message || 'Failed to book spot. Please try again.');
    } finally {
      setActionInProgress(null);
    }
  };
  
  const handleDeleteSpot = async (spotId: string) => {
    if (!onDeleteSpot) return;
    
    setActionInProgress(spotId);
    setActionError(null);
    
    try {
      await onDeleteSpot(spotId);
    } catch (error: any) {
      setActionError(error.response?.data?.message || 'Failed to delete spot. Please try again.');
    } finally {
      setActionInProgress(null);
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
      <Alert variant="error" title="Failed to load parking spots">
        {error}
      </Alert>
    );
  }
  
  if (spots.length === 0) {
    return (
      <div className="text-center py-12">
        <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No parking spots found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {isAdmin 
            ? "No parking spots have been created yet."
            : "There are currently no available parking spots."
          }
        </p>
      </div>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {spots.map((spot) => (
          <Card key={spot.id} className="transform transition-transform hover:scale-102 hover:shadow-lg">
            <CardBody>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${spot.isOccupied ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                    <Car className="h-6 w-6" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{spot.spotNumber}</h3>
                    <p className={`text-sm ${spot.isOccupied ? 'text-red-500' : 'text-green-500'}`}>
                      {spot.isOccupied ? 'Occupied' : 'Available'}
                    </p>
                  </div>
                </div>
                
                <div>
                  {isAdmin ? (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteSpot(spot.id)}
                      isLoading={actionInProgress === spot.id}
                      disabled={spot.isOccupied || actionInProgress === spot.id}
                      leftIcon={<Trash2 className="h-4 w-4" />}
                    >
                      Delete
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleBookSpot(spot.id)}
                      isLoading={actionInProgress === spot.id}
                      disabled={spot.isOccupied || actionInProgress === spot.id}
                    >
                      Book
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500 mt-2">
                <div>Created: {new Date(spot.createdAt).toLocaleString()}</div>
                <div>Last Updated: {new Date(spot.updatedAt).toLocaleString()}</div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        className="mt-8"
      />
    </div>
  );
};

export default ParkingSpotsList;