import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, MapPin, Search, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import DonationForm from '@/components/donor/DonationForm';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/page-transition';

// Sample donation data
const sampleDonations = [
  {
    id: '1',
    foodName: 'Fresh Vegetables',
    description: 'Assorted vegetables including carrots, potatoes, and tomatoes.',
    quantity: '5 kg',
    location: '123 Main St, City',
    expiryDate: '2023-07-15',
    availableTime: '14:00',
    contactName: 'John Doe',
    contactPhone: '555-1234',
    status: 'pending',
    createdAt: '2023-07-10T14:30:00',
  },
  {
    id: '2',
    foodName: 'Bread and Pastries',
    description: 'Assorted bread and pastries from our bakery.',
    quantity: '10 items',
    location: '456 Oak St, City',
    expiryDate: '2023-07-12',
    availableTime: '18:00',
    contactName: 'John Doe',
    contactPhone: '555-1234',
    status: 'accepted',
    createdAt: '2023-07-09T10:15:00',
    volunteer: {
      name: 'Michael Chen',
      phone: '555-5678',
      pickupTime: '2023-07-12T18:00:00',
    },
  },
  {
    id: '3',
    foodName: 'Canned Goods',
    description: 'Assorted canned vegetables, fruits, and soups.',
    quantity: '15 cans',
    location: '789 Pine St, City',
    expiryDate: '2023-12-31',
    availableTime: '10:00',
    contactName: 'John Doe',
    contactPhone: '555-1234',
    status: 'completed',
    createdAt: '2023-07-05T09:00:00',
    volunteer: {
      name: 'Elena Rodriguez',
      phone: '555-9012',
      pickupTime: '2023-07-06T10:00:00',
    },
  },
];

// Helper functions for status display
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

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [showDonationForm, setShowDonationForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredDonations = sampleDonations.filter(donation => {
    if (searchQuery === '') return true;
    
    const searchLower = searchQuery.toLowerCase();
    return (
      donation.foodName.toLowerCase().includes(searchLower) ||
      donation.description.toLowerCase().includes(searchLower) ||
      donation.location.toLowerCase().includes(searchLower)
    );
  });
  
  const activeDonations = filteredDonations.filter(donation => donation.status === 'pending' || donation.status === 'accepted');
  const completedDonations = filteredDonations.filter(donation => donation.status === 'completed');
  
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
              <DonationForm />
            </motion.div>
          )}
          
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Tabs 
                defaultValue="active" 
                className="w-full" 
                onValueChange={setActiveTab}
              >
                <TabsList className="glass">
                  <TabsTrigger value="active" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Active Donations
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Completed
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
            
            <TabsContent value="active" className="mt-0">
              {activeDonations.length === 0 ? (
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
            
            <TabsContent value="completed" className="mt-0">
              {completedDonations.length === 0 ? (
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
          </div>
        </div>
      </main>
      
      <Footer />
    </PageTransition>
  );
};

interface DonationItemProps {
  donation: {
    id: string;
    foodName: string;
    description: string;
    quantity: string;
    location: string;
    status: string;
    createdAt: string;
    volunteer?: {
      name: string;
      phone: string;
      pickupTime: string;
    };
  };
}

const DonationItem: React.FC<DonationItemProps> = ({ donation }) => {
  const formattedDate = new Date(donation.createdAt).toLocaleDateString('en-US', {
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
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-medium text-harvest-charcoal">{donation.foodName}</h3>
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
              
              {donation.volunteer && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-harvest-sage mr-2" />
                  <span className="text-harvest-charcoal/80">
                    Pickup by: {donation.volunteer.name}
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

export default DonorDashboard;
