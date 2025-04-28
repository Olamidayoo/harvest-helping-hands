
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from "@/components/ui/use-toast";
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
