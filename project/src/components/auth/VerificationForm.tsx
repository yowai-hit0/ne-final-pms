import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import AuthService from '../../services/auth.service';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';

const VerificationForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyEmail } = useAuth();
  
  // Get email from location state or localStorage
  const initialEmail = location.state?.email || localStorage.getItem('pendingVerificationEmail') || '';
  
  const [formData, setFormData] = useState({
    email: initialEmail,
    code: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // Store email in localStorage for persistence
  useEffect(() => {
    if (formData.email) {
      localStorage.setItem('pendingVerificationEmail', formData.email);
    }
  }, [formData.email]);
  
  // Timer for resend cooldown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
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
    
    if (!formData.code.trim()) {
      newErrors.code = 'Verification code is required';
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
      await verifyEmail(formData);
      setSuccess(true);
      localStorage.removeItem('pendingVerificationEmail');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Verification failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleResendCode = async () => {
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ ...errors, email: 'Please enter a valid email address' });
      return;
    }
    
    setResendLoading(true);
    setApiError(null);
    
    try {
      await AuthService.requestOtp(formData.email);
      setResendSuccess(true);
      setTimer(60); // Set 60-second cooldown
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error: any) {
      setApiError(error.response?.data?.message || 'Failed to resend code. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };
  
  if (success) {
    return (
      <div className="w-full max-w-md">
        <Alert variant="success" title="Account Verified!">
          <p>Your account has been successfully verified. You will be redirected to the login page shortly.</p>
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
            title="Verification Failed"
            onClose={() => setApiError(null)}
          >
            {apiError}
          </Alert>
        )}
        
        {resendSuccess && (
          <Alert
            variant="success"
            title="Code Sent"
            onClose={() => setResendSuccess(false)}
          >
            A new verification code has been sent to your email address.
          </Alert>
        )}
        
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
          disabled={isLoading}
        />
        
        <Input
          id="code"
          name="code"
          type="text"
          label="Verification Code"
          placeholder="Enter the 6-digit code from your email"
          value={formData.code}
          onChange={handleChange}
          error={errors.code}
          fullWidth
          leftIcon={<Key className="h-5 w-5 text-gray-400" />}
          disabled={isLoading}
        />
        
        <Button type="submit" variant="primary" fullWidth isLoading={isLoading}>
          Verify Account
        </Button>
        
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handleResendCode}
            isLoading={resendLoading}
            disabled={timer > 0 || resendLoading}
          >
            {timer > 0 ? `Resend Code (${timer}s)` : 'Resend Code'}
          </Button>
          
          <Link to="/login" className="font-medium text-blue-600 hover:underline text-sm">
            Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default VerificationForm;