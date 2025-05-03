
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
import DonationList from '@/components/admin/DonationList';
import UserList from '@/components/admin/UserList';

const AdminDashboard = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('donations');
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          setLoading(false);
          setIsAdmin(false);
          toast({
            title: "Authentication error",
            description: "You need to be logged in to access this page",
            variant: "destructive"
          });
          return;
        }
        
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error checking admin status:', error);
          toast({
            title: "Error checking admin status",
            description: error.message,
            variant: "destructive"
          });
          setIsAdmin(false);
        } else {
          setIsAdmin(data?.is_admin || false);
          
          if (!data?.is_admin) {
            toast({
              title: "Access denied",
              description: "You don't have admin privileges",
              variant: "destructive"
            });
          }
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
  }, [toast]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-harvest-sage animate-spin" />
        <span className="ml-2 text-lg text-harvest-sage">Checking admin privileges...</span>
      </div>
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
