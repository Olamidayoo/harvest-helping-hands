import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, MapPin, Search, ChevronDown, Plus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DonationForm from '@/components/donor/DonationForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/page-transition';
import { useAuth } from '@/contexts/AuthContext';
import { getDonationsByDonor, setupDonationsSubscription, supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

// Helper functions for status display - moved outside component scope to be accessible
const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'accepted':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-700 border-green-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Awaiting Volunteer';
    case 'accepted':
      return 'Pickup Scheduled';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

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
  image_url?: string;
}

// DonationItem component
interface DonationItemProps {
  donation: Donation;
}

const DonationItem: React.FC<DonationItemProps> = ({ donation }) => {
  const formattedDate = new Date(donation.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      <Card className="glass h-full overflow-hidden hover:shadow-md transition-all duration-300">
        <CardContent className="p-0">
          <div className="p-6">
            {donation.image_url && (
              <div className="mb-4 w-full h-40 overflow-hidden rounded-md">
                <img src={donation.image_url} alt={donation.food_name} className="w-full h-full object-cover" />
              </div>
            )}
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-harvest-charcoal">{donation.food_name}</h3>
              <Badge className={`${getStatusColor(donation.status)}`}>
                {getStatusText(donation.status)}
              </Badge>
            </div>
            
            <p className="text-sm text-harvest-charcoal/70 mb-4 line-clamp-2">{donation.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <Package className="w-4 h-4 text-harvest-sage mr-2" />
                <span className="text-harvest-charcoal/80">{donation.quantity}</span>
              </div>
              
              <div className="flex items-center text-sm">
                <MapPin className="w-4 h-4 text-harvest-sage mr-2" />
                <span className="text-harvest-charcoal/80 line-clamp-1">{donation.location}</span>
              </div>
              
              {donation.volunteer_id && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-harvest-sage mr-2" />
                  <span className="text-harvest-charcoal/80">
                    Pickup scheduled
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div className="px-6 py-3 bg-harvest-cream/50 text-sm text-harvest-charcoal/70 border-t border-harvest-sage/10">
            Added on {formattedDate}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const DonorDashboard = () => {
  const { user, userRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Function to fetch donations
  const fetchDonations = async () => {
    try {
      setIsLoading(true);
      
      if (!user) return;
      
      const { data, error } = await getDonationsByDonor(user.id);
      
      if (error) {
        throw error;
      }
      
      setDonations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching donations",
        description: error.message || "Failed to load your donations",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch donations for this donor
  useEffect(() => {
    if (user) {
      fetchDonations();
    }
  }, [user, toast]);
  
  // Setup real-time subscription
  useEffect(() => {
    if (!user) return;
    
    const channel = setupDonationsSubscription((payload) => {
      console.log("Donation changed:", payload);
      // Only refetch if the change is relevant to this user
      if (payload.new && payload.new.donor_id === user.id) {
        fetchDonations();
        
        if (payload.eventType === "INSERT") {
          toast({
            title: "Donation Added",
            description: "Your donation was successfully added",
          });
        }
      }
    });
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, toast]);

  // Handle donation form submission
  const handleDonationSubmitted = () => {
    setShowDonationForm(false);
    fetchDonations();
    toast({
      title: "Success!",
      description: "Your donation was submitted successfully",
    });
  };
  
  const filteredDonations = donations.filter(donation => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      donation.food_name.toLowerCase().includes(searchLower) ||
      donation.description?.toLowerCase().includes(searchLower) ||
      donation.location.toLowerCase().includes(searchLower)
    );
  });
  
  const activeDonations = filteredDonations.filter(donation => 
    donation.status === 'pending' || donation.status === 'accepted'
  );
  
  const completedDonations = filteredDonations.filter(donation => 
    donation.status === 'completed'
  );
  
  return (
    <PageTransition>
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-semibold text-harvest-charcoal">Donor Dashboard</h1>
              <p className="text-harvest-charcoal/70 mt-1">Manage your food donations and track their status</p>
            </div>
            
            <Button 
              onClick={() => setShowDonationForm(!showDonationForm)}
              className="mt-4 md:mt-0 bg-harvest-sage hover:bg-harvest-sage/90 text-white flex items-center gap-2"
            >
              {showDonationForm ? <ChevronDown className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showDonationForm ? 'Hide Form' : 'New Donation'}
            </Button>
          </div>
          
          {showDonationForm && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-10"
            >
              <DonationForm onDonationSubmitted={handleDonationSubmitted} />
            </motion.div>
          )}
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs 
                defaultValue="active"
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="glass">
                  <TabsTrigger value="active" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Active Donations
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Completed
                  </TabsTrigger>
                </TabsList>
                
                <div className="flex items-center justify-end mt-4 sm:mt-0">
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
                
                <TabsContent value="active" className="mt-6">
                  {isLoading ? (
                    <Card className="glass">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-harvest-charcoal/70">Loading donations...</p>
                      </CardContent>
                    </Card>
                  ) : activeDonations.length === 0 ? (
                    <Card className="glass">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                        <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No active donations</h3>
                        <p className="text-harvest-charcoal/70 text-center max-w-md">
                          You don't have any active donations yet. Click the "New Donation" button to create one.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {activeDonations.map((donation) => (
                        <DonationItem key={donation.id} donation={donation} />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="completed" className="mt-6">
                  {isLoading ? (
                    <Card className="glass">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <p className="text-harvest-charcoal/70">Loading donations...</p>
                      </CardContent>
                    </Card>
                  ) : completedDonations.length === 0 ? (
                    <Card className="glass">
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                        <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No completed donations</h3>
                        <p className="text-harvest-charcoal/70 text-center max-w-md">
                          You don't have any completed donations yet. They will appear here once volunteers have picked them up.
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {completedDonations.map((donation) => (
                        <DonationItem key={donation.id} donation={donation} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

export default DonorDashboard;
