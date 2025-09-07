import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ComplianceDashboard from './ComplianceDashboard';
import { useAuth } from './contexts/AuthContext';

// Dashboard wrapper with logout functionality
function DashboardWithAuth() {
  const { logout, currentUser } = useAuth();
  
  // Add user info and logout button to the dashboard
  React.useEffect(() => {
    // Store logout function globally for the dashboard to use
    window.handleLogout = logout;
    window.currentUser = currentUser;
  }, [logout, currentUser]);
  
  return <ComplianceDashboard />;
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Protected Routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardWithAuth />
              </ProtectedRoute>
            } 
          />
          
          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          
          {/* Catch all - redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}