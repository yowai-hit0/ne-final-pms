import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, Car } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    vehiclePlateNumber: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!formData.vehiclePlateNumber.trim()) {
      newErrors.vehiclePlateNumber = 'Vehicle plate number is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setApiError(null);
    
    try {
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      setSuccess(true);
      setTimeout(() => {
        navigate('/verification', { state: { email: formData.email } });
      }, 2000);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="w-full max-w-md">
        <Alert 
          variant="success"
          title="Registration Successful!"
        >
          <p className="mb-2">Your account has been created successfully.</p>
          <p>Please check your email for a verification code to activate your account.</p>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="w-full max-w-md">
      <form className="space-y-6" onSubmit={handleSubmit}>
        {apiError && (
          <Alert 
            variant="error"
            title="Registration Failed"
            onClose={() => setApiError(null)}
          >
            {apiError}
          </Alert>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="firstName"
            name="firstName"
            type="text"
            label="First Name"
            placeholder="John"
            value={formData.firstName}
            onChange={handleChange}
            error={errors.firstName}
            fullWidth
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />
          
          <Input
            id="lastName"
            name="lastName"
            type="text"
            label="Last Name"
            placeholder="Doe"
            value={formData.lastName}
            onChange={handleChange}
            error={errors.lastName}
            fullWidth
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email Address"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          fullWidth
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
          autoComplete="email"
        />
        
        <Input
          id="vehiclePlateNumber"
          name="vehiclePlateNumber"
          type="text"
          label="Vehicle Plate Number"
          placeholder="ABC123"
          value={formData.vehiclePlateNumber}
          onChange={handleChange}
          error={errors.vehiclePlateNumber}
          fullWidth
          leftIcon={<Car className="h-5 w-5 text-gray-400" />}
        />
        
        <Input
          id="password"
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          fullWidth
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          autoComplete="new-password"
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          fullWidth
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          autoComplete="new-password"
        />
        
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Register
        </Button>
        
        <div className="text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link to="/login" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;