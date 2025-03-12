
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter, Package } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import DonationCard from '@/components/volunteer/DonationCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/page-transition';
import { useAuth } from '@/contexts/AuthContext';
import { getAvailableDonations, getDonationsByVolunteer, updateDonationStatus } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Donation interface
interface Donation {
  id: string;
  food_name: string;
  description: string;
  quantity: string;
  location: string;
  status: string;
  created_at: string;
  donor_id: string;
  volunteer_id?: string;
  expiry_date?: string;
  available_time?: string;
  contact_name: string;
  contact_phone: string;
}

const VolunteerDashboard = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('available');
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Check if user is authenticated and has volunteer role
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to access the volunteer dashboard",
        variant: "destructive"
      });
      navigate('/login');
      return;
    }
    
    if (userRole !== 'volunteer') {
      toast({
        title: "Access denied",
        description: "This dashboard is only for volunteers",
        variant: "destructive"
      });
      navigate('/');
      return;
    }
    
    const fetchDonations = async () => {
      setIsLoading(true);
      try {
        // Fetch available donations
        const availableRes = await getAvailableDonations();
        if (availableRes.error) throw availableRes.error;
        setAvailableDonations(availableRes.data || []);
        
        // Fetch volunteer's accepted donations
        const myRes = await getDonationsByVolunteer(user.id);
        if (myRes.error) throw myRes.error;
        setMyDonations(myRes.data || []);
      } catch (error: any) {
        toast({
          title: "Error fetching donations",
          description: error.message || "Failed to load donations",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDonations();
  }, [user, userRole, navigate, toast]);
  
  const handleAcceptDonation = async (donationId: string) => {
    try {
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "You need to be logged in to accept a donation",
          variant: "destructive"
        });
        return;
      }
      
      const { data, error } = await updateDonationStatus(donationId, 'accepted', user.id);
      
      if (error) throw error;
      
      // Update local state
      const acceptedDonation = availableDonations.find(d => d.id === donationId);
      if (acceptedDonation) {
        setAvailableDonations(prev => prev.filter(d => d.id !== donationId));
        setMyDonations(prev => [...prev, {...acceptedDonation, status: 'accepted', volunteer_id: user.id}]);
      }
      
      toast({
        title: "Donation accepted",
        description: "You have successfully accepted this donation",
      });
    } catch (error: any) {
      toast({
        title: "Error accepting donation",
        description: error.message || "Failed to accept donation",
        variant: "destructive"
      });
    }
  };
  
  const handleCompleteDonation = async (donationId: string) => {
    try {
      const { error } = await updateDonationStatus(donationId, 'completed');
      
      if (error) throw error;
      
      // Update local state
      setMyDonations(prev => prev.map(d => 
        d.id === donationId ? {...d, status: 'completed'} : d
      ));
      
      toast({
        title: "Pickup completed",
        description: "Thank you for helping reduce food waste!",
      });
    } catch (error: any) {
      toast({
        title: "Error completing pickup",
        description: error.message || "Failed to mark as completed",
        variant: "destructive"
      });
    }
  };
  
  const filteredAvailableDonations = availableDonations.filter(donation => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      donation.food_name.toLowerCase().includes(searchLower) ||
      donation.description.toLowerCase().includes(searchLower) ||
      donation.location.toLowerCase().includes(searchLower)
    );
  });
  
  const filteredMyDonations = myDonations.filter(donation => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      donation.food_name.toLowerCase().includes(searchLower) ||
      donation.description.toLowerCase().includes(searchLower) ||
      donation.location.toLowerCase().includes(searchLower)
    );
  });
  
  return (
    <PageTransition>
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-harvest-charcoal">Volunteer Dashboard</h1>
            <p className="text-harvest-charcoal/70 mt-1">Find and manage food donations in your area</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs 
                defaultValue="available" 
                className="w-full" 
                onValueChange={setActiveTab}
                value={activeTab}
              >
                <TabsList className="glass">
                  <TabsTrigger value="available" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Available Donations
                  </TabsTrigger>
                  <TabsTrigger value="my-pickups" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    My Pickups
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-harvest-charcoal/50 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search donations..."
                  className="pl-10 border-harvest-sage/30 focus:border-harvest-sage glass"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="available" className="mt-0">
              {isLoading ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-harvest-charcoal/70">Loading donations...</p>
                  </CardContent>
                </Card>
              ) : filteredAvailableDonations.length === 0 ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                    <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No available donations</h3>
                    <p className="text-harvest-charcoal/70 text-center max-w-md">
                      There are currently no available donations. Please check back later.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAvailableDonations.map((donation) => (
                    <DonationCard 
                      key={donation.id} 
                      donation={{
                        id: donation.id,
                        title: donation.food_name,
                        description: donation.description,
                        quantity: donation.quantity,
                        location: donation.location,
                        expiryDate: donation.expiry_date,
                        availableTime: donation.available_time,
                        contactName: donation.contact_name,
                        contactPhone: donation.contact_phone,
                        status: donation.status,
                        createdAt: donation.created_at
                      }}
                      onAccept={handleAcceptDonation}
                      onComplete={null}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="my-pickups" className="mt-0">
              {isLoading ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <p className="text-harvest-charcoal/70">Loading donations...</p>
                  </CardContent>
                </Card>
              ) : filteredMyDonations.length === 0 ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                    <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No pickups yet</h3>
                    <p className="text-harvest-charcoal/70 text-center max-w-md">
                      You haven't accepted any donations yet. Check the Available Donations tab to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredMyDonations.map((donation) => (
                    <DonationCard 
                      key={donation.id} 
                      donation={{
                        id: donation.id,
                        title: donation.food_name,
                        description: donation.description,
                        quantity: donation.quantity,
                        location: donation.location,
                        expiryDate: donation.expiry_date,
                        availableTime: donation.available_time,
                        contactName: donation.contact_name,
                        contactPhone: donation.contact_phone,
                        status: donation.status,
                        createdAt: donation.created_at
                      }}
                      onAccept={null}
                      onComplete={donation.status === 'accepted' ? handleCompleteDonation : null}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default VolunteerDashboard;
