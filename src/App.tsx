
import React, { useState, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { supabase } from '@/lib/supabase';
import AdminDashboard from "./pages/AdminDashboard";
import IndexPage from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import DonorDashboard from "./pages/DonorDashboard";
import VolunteerDashboard from "./pages/VolunteerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route component that redirects to login if not authenticated
// or to home if authenticated but with wrong role
const ProtectedRoute = ({ 
  children, 
  requiredRole 
}: { 
  children: React.ReactNode, 
  requiredRole: 'donor' | 'volunteer' 
}) => {
  const { user, userRole, loading } = useAuth();
  
  // Show nothing while checking auth status
  if (loading) {
    return null;
  }
  
  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Redirect to home if wrong role
  if (userRole !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has the right role
  return <>{children}</>;
};

// Enhanced AdminRoute component that checks for admin role
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  // We don't need the admin check logic here anymore
  // The AdminDashboard component now handles its own access control
  return <>{children}</>;
};

// Route that redirects to dashboard if already logged in
const RedirectIfAuthenticated = ({
  children
}: {
  children: React.ReactNode
}) => {
  const { user, userRole, loading } = useAuth();
  
  // Show nothing while checking auth status
  if (loading) {
    return null;
  }
  
  // Redirect to appropriate dashboard if authenticated
  if (user && userRole) {
    if (userRole === 'donor') {
      return <Navigate to="/donor" replace />;
    } else if (userRole === 'volunteer') {
      return <Navigate to="/volunteer" replace />;
    }
  }
  
  // User is not authenticated, show the requested page
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route path="/" element={<IndexPage />} />
        
        {/* Auth routes with redirect if already logged in */}
        <Route 
          path="/login" 
          element={
            <RedirectIfAuthenticated>
              <Login />
            </RedirectIfAuthenticated>
          }
        />
        
        <Route 
          path="/signup" 
          element={
            <RedirectIfAuthenticated>
              <Signup />
            </RedirectIfAuthenticated>
          }
        />
        
        <Route path="/about" element={<About />} />
        
        {/* Protected donor route */}
        <Route 
          path="/donor" 
          element={
            <ProtectedRoute requiredRole="donor">
              <DonorDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Protected volunteer route */}
        <Route 
          path="/volunteer" 
          element={
            <ProtectedRoute requiredRole="volunteer">
              <VolunteerDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Admin route - simplified, admin check moved to AdminDashboard component */}
        <Route path="/admin" element={<AdminDashboard />} />
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
