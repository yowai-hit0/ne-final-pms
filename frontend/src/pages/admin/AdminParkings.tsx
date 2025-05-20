import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { PencilIcon, PlusCircle, Trash } from 'lucide-react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Alert from '../../components/ui/Alert';
import Pagination from '../../components/ui/Pagination';
import { PaginationParams, Parking } from '../../types';
import { createParking, deleteParking, getAllParkings, updateParking } from '../../services/parkingService';

type ParkingFormData = Omit<Parking, 'id' | 'createdAt' | 'updatedAt'>;

const AdminParkings: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
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
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ParkingFormData>();

  const fetchParkings = async (params: PaginationParams) => {
    try {
      setLoading(true);
      const response = await getAllParkings(params);
      
      if (response.status === 'success') {
        setParkings(response.data.parkings);
        setMeta(response.data.meta);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load parkings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings({ page: 1, limit: 10 });
  }, []);

  const handlePageChange = (page: number) => {
    fetchParkings({ page, limit: meta.limit });
  };

  const onSubmit = async (data: ParkingFormData) => {
    try {
      setActionLoading(true);
      setError(null);
      
      // Ensure numeric fields are numbers
      const formattedData = {
        ...data,
        numberOfAvailableSpace: Number(data.numberOfAvailableSpace),
        chargingFeePerHour: Number(data.chargingFeePerHour),
      };
      
      let response;
      
      if (editingId) {
        response = await updateParking(editingId, formattedData);
        setSuccess('Parking location updated successfully');
      } else {
        response = await createParking(formattedData);
        setSuccess('Parking location created successfully');
      }
      
      if (response.status === 'success') {
        // Refresh the list
        fetchParkings({ page: meta.page, limit: meta.limit });
        
        // Reset form
        reset();
        setShowForm(false);
        setEditingId(null);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save parking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = (parking: Parking) => {
    setEditingId(parking.id);
    setValue('code', parking.code);
    setValue('name', parking.name);
    setValue('address', parking.address);
    setValue('numberOfAvailableSpace', parking.numberOfAvailableSpace);
    setValue('chargingFeePerHour', parking.chargingFeePerHour);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this parking location?')) {
      return;
    }
    
    try {
      setActionLoading(true);
      
      const response = await deleteParking(id);
      
      if (response.status === 'success') {
        setSuccess('Parking location deleted successfully');
        fetchParkings({ page: meta.page, limit: meta.limit });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to delete parking');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddNew = () => {
    reset();
    setEditingId(null);
    setShowForm(true);
  };

  const handleCancel = () => {
    reset();
    setShowForm(false);
    setEditingId(null);
  };

  if (loading && parkings.length === 0) {
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
          <h1 className="text-3xl font-bold text-gray-900">Manage Parking Locations</h1>
          <p className="mt-2 text-gray-600">
            Add, update and remove parking locations
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleAddNew}
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Add New Location
        </Button>
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

      {showForm && (
        <Card className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? 'Edit Parking Location' : 'Add New Parking Location'}
          </h2>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <Input
                label="Code"
                type="text"
                error={errors.code?.message}
                {...register('code', {
                  required: 'Code is required',
                })}
              />
              
              <Input
                label="Name"
                type="text"
                error={errors.name?.message}
                {...register('name', {
                  required: 'Name is required',
                })}
              />
              
              <Input
                label="Address"
                type="text"
                error={errors.address?.message}
                {...register('address', {
                  required: 'Address is required',
                })}
              />
              
              <Input
                label="Number of Available Spaces"
                type="number"
                min="0"
                error={errors.numberOfAvailableSpace?.message}
                {...register('numberOfAvailableSpace', {
                  required: 'Number of spaces is required',
                  min: {
                    value: 0,
                    message: 'Spaces cannot be negative',
                  },
                })}
              />
              
              <Input
                label="Charging Fee Per Hour ($)"
                type="number"
                step="0.01"
                min="0"
                error={errors.chargingFeePerHour?.message}
                {...register('chargingFeePerHour', {
                  required: 'Fee is required',
                  min: {
                    value: 0,
                    message: 'Fee cannot be negative',
                  },
                })}
              />
            </div>
            
            <div className="flex gap-3">
              <Button
                type="submit"
                variant="primary"
                isLoading={actionLoading}
              >
                {editingId ? 'Update' : 'Create'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Parkings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Available Spaces
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fee Per Hour
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {parkings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                    No parking locations found
                  </td>
                </tr>
              ) : (
                parkings.map((parking) => (
                  <tr key={parking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {parking.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parking.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parking.address}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {parking.numberOfAvailableSpace}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${parking.chargingFeePerHour.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(parking)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(parking.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
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

export default AdminParkings;