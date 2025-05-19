import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { Card, CardHeader, CardBody, CardFooter } from '../ui/Card';

interface SpotCreationFormProps {
  onCreateSpot: (spotNumber: string) => Promise<void>;
  onGenerateSpots: (prefix: string, count: number) => Promise<void>;
}

const SpotCreationForm: React.FC<SpotCreationFormProps> = ({
  onCreateSpot,
  onGenerateSpots,
}) => {
  const [singleSpotNumber, setSingleSpotNumber] = useState('');
  const [bulkPrefix, setBulkPrefix] = useState('');
  const [bulkCount, setBulkCount] = useState(10);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'single' | 'bulk'>('single');
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const handleSingleSpotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!singleSpotNumber.trim()) {
      setErrors({ singleSpotNumber: 'Spot number is required' });
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onCreateSpot(singleSpotNumber);
      setSingleSpotNumber('');
      setSuccess('Parking spot created successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create spot. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleBulkGenerationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!bulkPrefix.trim()) {
      newErrors.bulkPrefix = 'Prefix is required';
    }
    
    if (!bulkCount || bulkCount <= 0) {
      newErrors.bulkCount = 'Count must be greater than 0';
    } else if (bulkCount > 100) {
      newErrors.bulkCount = 'Cannot generate more than 100 spots at once';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      await onGenerateSpots(bulkPrefix, bulkCount);
      setBulkPrefix('');
      setBulkCount(10);
      setSuccess(`Successfully generated ${bulkCount} parking spots!`);
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to generate spots. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <h2 className="text-xl font-semibold text-gray-900">Add Parking Spots</h2>
      </CardHeader>
      
      <CardBody>
        {success && (
          <Alert 
            variant="success"
            title="Success"
            onClose={() => setSuccess(null)}
            className="mb-4"
          >
            {success}
          </Alert>
        )}
        
        {error && (
          <Alert 
            variant="error"
            title="Error"
            onClose={() => setError(null)}
            className="mb-4"
          >
            {error}
          </Alert>
        )}
        
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-4">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('single')}
              className={`${
                activeTab === 'single'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}
            >
              Single Spot
            </button>
            
            <button
              onClick={() => setActiveTab('bulk')}
              className={`${
                activeTab === 'bulk'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap pb-2 px-1 border-b-2 font-medium text-sm`}
            >
              Bulk Generation
            </button>
          </nav>
        </div>
        
        {/* Single Spot Form */}
        {activeTab === 'single' && (
          <form onSubmit={handleSingleSpotSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <Input
                  id="singleSpotNumber"
                  label="Spot Number"
                  placeholder="e.g., A-12"
                  value={singleSpotNumber}
                  onChange={(e) => {
                    setSingleSpotNumber(e.target.value);
                    if (errors.singleSpotNumber) {
                      setErrors({ ...errors, singleSpotNumber: '' });
                    }
                  }}
                  error={errors.singleSpotNumber}
                  fullWidth
                  disabled={isLoading}
                />
              </div>
              
              <div className="self-end">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Spot
                </Button>
              </div>
            </div>
          </form>
        )}
        
        {/* Bulk Generation Form */}
        {activeTab === 'bulk' && (
          <form onSubmit={handleBulkGenerationSubmit}>
            <div className="space-y-4">
              <div>
                <Input
                  id="bulkPrefix"
                  label="Spot Prefix"
                  placeholder="e.g., A-, B-, LEVEL-1-"
                  value={bulkPrefix}
                  onChange={(e) => {
                    setBulkPrefix(e.target.value);
                    if (errors.bulkPrefix) {
                      setErrors({ ...errors, bulkPrefix: '' });
                    }
                  }}
                  helperText="This will be prepended to each spot number"
                  error={errors.bulkPrefix}
                  fullWidth
                  disabled={isLoading}
                />
              </div>
              
              <div>
                <Input
                  id="bulkCount"
                  type="number"
                  label="Number of Spots"
                  value={bulkCount.toString()}
                  onChange={(e) => {
                    setBulkCount(parseInt(e.target.value) || 0);
                    if (errors.bulkCount) {
                      setErrors({ ...errors, bulkCount: '' });
                    }
                  }}
                  min={1}
                  max={100}
                  helperText="Maximum 100 spots at a time"
                  error={errors.bulkCount}
                  fullWidth
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Generate Spots
              </Button>
            </div>
          </form>
        )}
      </CardBody>
      
      <CardFooter className="bg-gray-50 text-sm text-gray-600">
        <p>
          {activeTab === 'single'
            ? 'Create a single parking spot with a custom identifier.'
            : 'Generate multiple spots at once with sequential numbering.'}
        </p>
      </CardFooter>
    </Card>
  );
};

export default SpotCreationForm;