import React from 'react';
import { Car } from 'lucide-react';
import RegisterForm from '../../components/auth/RegisterForm';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const RegisterPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow flex items-center justify-center py-12 bg-gray-50">
        <div className="max-w-md w-full px-6">
          <div className="text-center mb-8">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-blue-500 text-white rounded-full flex items-center justify-center">
                <Car className="h-6 w-6" />
              </div>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Create an account</h2>
            <p className="mt-2 text-sm text-gray-600">
              Join ParkEase to manage your parking experience
            </p>
          </div>
          
          <div className="bg-white py-8 px-6 shadow rounded-lg">
            <RegisterForm />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default RegisterPage;