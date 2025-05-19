import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import VerificationPage from './pages/auth/VerificationPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import BookingsPage from './pages/bookings/BookingsPage';

// Routes
import ProtectedRoute from './routes/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Route Guard for Dashboard (redirects to correct dashboard based on role)
const DashboardRouter = () => {
  const { state } = useAuth();
  const { user } = state;
  
  if (user?.role === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return <Navigate to="/user/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          
          {/* Dashboard redirect */}
          <Route path="/dashboard" element={<DashboardRouter />} />
          
          {/* Protected routes for any authenticated user */}
          <Route element={<ProtectedRoute />}>
            <Route path="/bookings" element={<BookingsPage />} />
          </Route>
          
          {/* Protected routes for regular users */}
          <Route element={<ProtectedRoute requiredRole="USER" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
          </Route>
          
          {/* Protected routes for admins */}
          <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/spots" element={<AdminDashboard />} />
          </Route>
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;