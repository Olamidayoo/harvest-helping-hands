
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Package, Users, BarChart, Clock } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    totalDonations: 0,
    totalUsers: 0,
    pendingDonations: 0,
    completedDonations: 0
  });
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Fetch dashboard statistics
  const fetchDashboardStats = async () => {
    try {
      // Get total donations count
      const { count: totalDonations, error: donationsError } = await supabase
        .from('donations')
        .select('id', { count: 'exact', head: true });

      if (donationsError) throw donationsError;

      // Get pending donations count
      const { count: pendingDonations, error: pendingError } = await supabase
        .from('donations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingError) throw pendingError;

      // Get completed donations count
      const { count: completedDonations, error: completedError } = await supabase
        .from('donations')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed');

      if (completedError) throw completedError;

      // Get total users count
      const { count: totalUsers, error: usersError } = await supabase
        .from('profiles')
        .select('id', { count: 'exact', head: true });

      if (usersError) throw usersError;

      setStats({
        totalDonations: totalDonations || 0,
        pendingDonations: pendingDonations || 0,
        completedDonations: completedDonations || 0,
        totalUsers: totalUsers || 0,
      });

    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast({
        title: "Error fetching statistics",
        description: "Could not load dashboard statistics",
        variant: "destructive"
      });
    }
  };

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
        
        if (adminStatus) {
          // Fetch dashboard stats if the user is an admin
          await fetchDashboardStats();
        } else {
          toast({
            title: "Access denied",
            description: "You don't have admin privileges",
            variant: "destructive"
          });
        }
      } catch (error) {
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-harvest-charcoal">Admin Dashboard</h1>
              <p className="text-harvest-charcoal/70">Manage donations, users, and site settings</p>
            </div>
            <div className="mt-4 md:mt-0">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                Admin Mode
              </span>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="glass w-full justify-start mb-6 overflow-x-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="mt-6 space-y-6">
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {/* Total Donations Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="glass">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-blue-100">
                          <Package className="h-6 w-6 text-blue-700" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-harvest-charcoal/70">Total Donations</p>
                          <h3 className="text-2xl font-bold text-harvest-charcoal">{stats.totalDonations}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Pending Donations Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <Card className="glass">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-yellow-100">
                          <Clock className="h-6 w-6 text-yellow-700" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-harvest-charcoal/70">Pending Donations</p>
                          <h3 className="text-2xl font-bold text-harvest-charcoal">{stats.pendingDonations}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Completed Donations Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Card className="glass">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-green-100">
                          <BarChart className="h-6 w-6 text-green-700" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-harvest-charcoal/70">Completed Donations</p>
                          <h3 className="text-2xl font-bold text-harvest-charcoal">{stats.completedDonations}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Total Users Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Card className="glass">
                    <CardContent className="pt-6">
                      <div className="flex items-center">
                        <div className="p-2 rounded-full bg-purple-100">
                          <Users className="h-6 w-6 text-purple-700" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm text-harvest-charcoal/70">Total Users</p>
                          <h3 className="text-2xl font-bold text-harvest-charcoal">{stats.totalUsers}</h3>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                {/* Recent Donations Summary */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-harvest-charcoal">Recent Donations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DonationList />
                  </CardContent>
                </Card>

                {/* Admin Users Summary */}
                <Card className="glass">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold text-harvest-charcoal">Admin Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <UserList />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
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
