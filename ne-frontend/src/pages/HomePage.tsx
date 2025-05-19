import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, ShieldCheck, Clock, MapPin } from 'lucide-react';
import Button from '../components/ui/Button';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: "url('https://images.pexels.com/photos/1004665/pexels-photo-1004665.jpeg')" }}></div>
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full md:w-1/2 mb-8 md:mb-0">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                  Smart Parking Management Made Simple
                </h1>
                <p className="text-xl mb-6 text-blue-100">
                  Find, book, and manage parking spots with ease. Our intelligent system streamlines the entire parking experience.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    className="bg-white text-blue-700 hover:bg-blue-50"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg" 
                    className="border-white text-white hover:bg-white/10"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                </div>
              </div>
              <div className="w-full md:w-1/2 flex justify-center">
                <div className="w-full max-w-md">
                  <div className="bg-white rounded-lg shadow-2xl p-6 transform rotate-2 transition-transform hover:rotate-0">
                    <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img 
                        src="https://images.pexels.com/photos/3408744/pexels-photo-3408744.jpeg" 
                        alt="Parking Garage" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Car className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <h3 className="text-lg font-medium text-gray-900">Spot A-12</h3>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Available
                          </span>
                        </div>
                      </div>
                      <Button variant="primary" fullWidth>
                        Book Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Our Parking System?</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our smart parking management solution offers a seamless experience from finding a spot to releasing it when you're done.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature 1 */}
              <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Easy Spot Finding</h3>
                <p className="text-gray-600">
                  Quickly locate available parking spots in your preferred location without circling around.
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Real-time Updates</h3>
                <p className="text-gray-600">
                  Get instant notifications about your booking status and parking availability.
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <Car className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Hassle-free Booking</h3>
                <p className="text-gray-600">
                  Book and release parking spots with just a few taps — no paperwork or physical tickets needed.
                </p>
              </div>
              
              {/* Feature 4 */}
              <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg hover:-translate-y-1">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <ShieldCheck className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Management</h3>
                <p className="text-gray-600">
                  Advanced security protocols ensure your booking information is always protected.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Follow these simple steps to make the most of our parking management system
              </p>
            </div>
            
            <div className="flex flex-col md:flex-row items-center justify-between max-w-5xl mx-auto">
              {/* Step 1 */}
              <div className="text-center px-4 mb-8 md:mb-0">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up with your email and vehicle information to get started.
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              
              {/* Step 2 */}
              <div className="text-center px-4 mb-8 md:mb-0">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Browse Available Spots</h3>
                <p className="text-gray-600">
                  View all available parking spots in the dashboard.
                </p>
              </div>
              
              {/* Arrow */}
              <div className="hidden md:block text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
              
              {/* Step 3 */}
              <div className="text-center px-4">
                <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Book and Park</h3>
                <p className="text-gray-600">
                  Reserve your spot and park your vehicle with confidence.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-teal-600 to-teal-800 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to simplify your parking experience?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their parking routine with our smart management system.
            </p>
            <Button 
              variant="primary" 
              size="lg" 
              className="bg-white text-teal-700 hover:bg-teal-50"
              onClick={() => navigate('/register')}
            >
              Get Started Now
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;