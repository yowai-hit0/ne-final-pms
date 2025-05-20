import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { logout } from '../services/authService';
import { Car, LogOut, Menu, User, X } from 'lucide-react';
import Button from './ui/Button';

const Header: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout: clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      clearAuth();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userLinks = [
    { text: 'Dashboard', path: '/', adminOnly: false },
    { text: 'My Tickets', path: '/my-tickets', adminOnly: false },
    { text: 'All Parkings', path: '/admin/parkings', adminOnly: true },
    { text: 'All Tickets', path: '/admin/tickets', adminOnly: true },
    { text: 'Reports', path: '/admin/reports', adminOnly: true },
  ];

  // Filter links based on user role
  const filteredLinks = userLinks.filter(link => {
    if (link.adminOnly) {
      return isAdmin;
    }
    return true;
  });

  return (
    <header className="bg-white shadow-sm fixed top-0 inset-x-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center text-blue-600">
                <Car className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold">ParkEasy</span>
              </Link>
            </div>
            
            {/* Desktop navigation */}
            <nav className="hidden md:ml-6 md:flex md:space-x-4 items-center">
              {isAuthenticated && filteredLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className="text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150"
                >
                  {link.text}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right side buttons/info */}
          <div className="hidden md:flex items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <div className="mr-4 text-sm text-gray-600">
                  <span className="block font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <span className="block text-xs">{user?.role}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-600 hover:text-blue-600 p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t">
            {isAuthenticated && filteredLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="block text-gray-600 hover:text-blue-600 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.text}
              </Link>
            ))}
          </div>

          {/* Mobile menu auth buttons */}
          <div className="px-4 py-3 border-t">
            {isAuthenticated ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">
                      {user?.firstName} {user?.lastName}
                    </div>
                    <div className="text-sm font-medium text-gray-500">
                      {user?.email}
                    </div>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  icon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link 
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="outline" size="sm" fullWidth>
                    Login
                  </Button>
                </Link>
                <Link 
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full"
                >
                  <Button variant="primary" size="sm" fullWidth>
                    Register
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;