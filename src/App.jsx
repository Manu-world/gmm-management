import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Import components
import LandingPage from './components/LandingPage';
import LoginPage from './components/Login';
import PasswordReset from './components/ResetPassword';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import UnauthorizedPage from './components/UnauthorizedPage';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/set_password/*" element={<PasswordReset />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/admin/*" element={<AdminDashboard />} /> */}
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Protected admin routes */}
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Protected user routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute allowedRoles={['Member']}>
                  <UserDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;