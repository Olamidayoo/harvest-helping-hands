
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/page-transition';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import DonationList from '@/components/admin/DonationList';
import UserList from '@/components/admin/UserList';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('donations');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Only check admin status if user is loaded and authenticated
    if (authLoading) {
      return; // Wait for auth to initialize
    }
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the admin dashboard",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    const checkAdminStatus = async () => {
      try {
        console.log("Checking admin status for user:", user.id);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        console.log("Admin check result:", data, error);
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error checking admin status",
            description: error.message,
            variant: "destructive"
          });
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        
        const adminStatus = !!data?.is_admin;
        setIsAdmin(adminStatus);
        
        if (!adminStatus) {
          toast({
            title: "Access denied",
            description: "You don't have admin privileges",
            variant: "destructive"
          });
        }
      } catch (error: any) {
        console.error('Admin check error:', error);
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive"
        });
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, authLoading, toast, navigate]);

  if (authLoading || loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-harvest-sage animate-spin" />
        <span className="ml-2 text-lg text-harvest-sage">Checking admin privileges...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-harvest-charcoal mb-4">Authentication Required</h2>
                <p className="text-harvest-charcoal/80">
                  You must be logged in to access the admin dashboard.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  if (!isAdmin) {
    return (
      <PageTransition>
        <Navbar />
        <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass">
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold text-harvest-charcoal mb-4">Access Denied</h2>
                <p className="text-harvest-charcoal/80">
                  You don't have permission to access the admin dashboard. 
                  If you believe this is an error, please contact the site administrator.
                </p>
              </CardContent>
            </Card>
          </div>
        </main>
        <Footer />
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold text-harvest-charcoal mb-8">Admin Dashboard</h1>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass">
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="donations" className="mt-6">
              <DonationList />
            </TabsContent>
            
            <TabsContent value="users" className="mt-6">
              <UserList />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </PageTransition>
  );
};

export default AdminDashboard;
