
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Package, Filter, MapPin, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import DonationCard from '@/components/volunteer/DonationCard';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageTransition from '@/components/ui/page-transition';

// Sample donation data - similar to donor but with different statuses from volunteer perspective
const sampleDonations = [
  {
    id: '1',
    foodName: 'Fresh Vegetables',
    description: 'Assorted vegetables including carrots, potatoes, and tomatoes.',
    quantity: '5 kg',
    location: '123 Main St, City',
    expiryDate: '2023-07-15',
    availableTime: '14:00',
    contactName: 'Jane Smith',
    contactPhone: '555-1234',
    status: 'available',
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
    contactName: 'Robert Johnson',
    contactPhone: '555-5678',
    status: 'available',
    createdAt: '2023-07-09T10:15:00',
  },
  {
    id: '3',
    foodName: 'Canned Goods',
    description: 'Assorted canned vegetables, fruits, and soups.',
    quantity: '15 cans',
    location: '789 Pine St, City',
    expiryDate: '2023-12-31',
    availableTime: '10:00',
    contactName: 'Sarah Wang',
    contactPhone: '555-9012',
    status: 'claimed',
    createdAt: '2023-07-05T09:00:00',
    claimedAt: '2023-07-05T15:30:00',
  },
  {
    id: '4',
    foodName: 'Prepared Meals',
    description: 'Restaurant-quality prepared meals, individually packaged.',
    quantity: '8 meals',
    location: '321 Elm St, City',
    expiryDate: '2023-07-11',
    availableTime: '19:00',
    contactName: 'David Lee',
    contactPhone: '555-3456',
    status: 'completed',
    createdAt: '2023-07-02T11:45:00',
    claimedAt: '2023-07-02T14:20:00',
    completedAt: '2023-07-03T19:15:00',
  },
];

const VolunteerDashboard = () => {
  const [activeTab, setActiveTab] = useState('available');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSort, setSelectedSort] = useState('newest');
  
  const handleAcceptDonation = (id: string) => {
    // In a real app, this would update the database
    console.log(`Accepted donation ${id}`);
  };
  
  const handleRejectDonation = (id: string) => {
    // In a real app, this would update the database
    console.log(`Rejected donation ${id}`);
  };
  
  // Filter donations based on search and tab
  const filteredDonations = sampleDonations.filter(donation => {
    // First filter by search query
    if (searchQuery !== '') {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        donation.foodName.toLowerCase().includes(searchLower) ||
        donation.description.toLowerCase().includes(searchLower) ||
        donation.location.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Then filter by tab/status
    if (activeTab === 'available') {
      return donation.status === 'available';
    } else if (activeTab === 'claimed') {
      return donation.status === 'claimed';
    } else {
      return donation.status === 'completed';
    }
  });
  
  // Sort donations
  const sortedDonations = [...filteredDonations].sort((a, b) => {
    if (selectedSort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (selectedSort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (selectedSort === 'expiringSoon') {
      // For simplicity, just sort by expiry date
      return new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
    }
    return 0;
  });
  
  return (
    <PageTransition>
      <Navbar />
      
      <main className="min-h-screen pt-24 pb-16 bg-harvest-cream/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-harvest-charcoal">Volunteer Dashboard</h1>
            <p className="text-harvest-charcoal/70 mt-1">Browse available donations and manage your pickups</p>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row justify-between gap-4">
              <Tabs 
                defaultValue="available" 
                className="w-full lg:w-auto" 
                onValueChange={setActiveTab}
              >
                <TabsList className="glass w-full lg:w-auto">
                  <TabsTrigger value="available" className="flex-1 lg:flex-initial data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Available
                  </TabsTrigger>
                  <TabsTrigger value="claimed" className="flex-1 lg:flex-initial data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    My Pickups
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex-1 lg:flex-initial data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                    Completed
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-harvest-charcoal/50 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search donations..."
                    className="pl-10 border-harvest-sage/30 focus:border-harvest-sage glass w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-full sm:w-[180px] glass border-harvest-sage/30 focus:border-harvest-sage">
                    <div className="flex items-center">
                      <Filter className="mr-2 h-4 w-4 text-harvest-sage" />
                      <SelectValue placeholder="Sort by" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="expiringSoon">Expiring Soon</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <TabsContent value="available" className="mt-0">
              {activeTab === 'available' && sortedDonations.length === 0 ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                    <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No available donations</h3>
                    <p className="text-harvest-charcoal/70 text-center max-w-md">
                      There are no available donations at the moment. Please check back later.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTab === 'available' && sortedDonations.map((donation) => (
                    <DonationCard 
                      key={donation.id} 
                      donation={donation} 
                      onAccept={handleAcceptDonation}
                      onReject={handleRejectDonation}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="claimed" className="mt-0">
              {activeTab === 'claimed' && sortedDonations.length === 0 ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                    <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No claimed donations</h3>
                    <p className="text-harvest-charcoal/70 text-center max-w-md">
                      You haven't claimed any donations yet. Browse the available donations to get started.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTab === 'claimed' && sortedDonations.map((donation) => (
                    <ClaimedDonationCard key={donation.id} donation={donation} />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="completed" className="mt-0">
              {activeTab === 'completed' && sortedDonations.length === 0 ? (
                <Card className="glass">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Package className="h-12 w-12 text-harvest-sage/50 mb-4" />
                    <h3 className="text-xl font-medium text-harvest-charcoal mb-2">No completed pickups</h3>
                    <p className="text-harvest-charcoal/70 text-center max-w-md">
                      You haven't completed any pickups yet. They will appear here after you've picked them up.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {activeTab === 'completed' && sortedDonations.map((donation) => (
                    <CompletedDonationCard key={donation.id} donation={donation} />
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

interface ClaimedDonationCardProps {
  donation: {
    id: string;
    foodName: string;
    description: string;
    quantity: string;
    location: string;
    expiryDate: string;
    availableTime: string;
    contactName: string;
    contactPhone: string;
    createdAt: string;
    claimedAt?: string;
  };
}

const ClaimedDonationCard: React.FC<ClaimedDonationCardProps> = ({ donation }) => {
  const formattedClaimedDate = donation.claimedAt 
    ? new Date(donation.claimedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  
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
              <Badge className="bg-blue-100 text-blue-700 border-blue-200">
                Pickup Scheduled
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
              
              <div className="flex items-center text-sm">
                <Calendar className="w-4 h-4 text-harvest-sage mr-2" />
                <span className="text-harvest-charcoal/80">Pickup time: {donation.availableTime}</span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-harvest-sage/5 border-t border-harvest-sage/10">
            <Button 
              className="w-full bg-harvest-sage hover:bg-harvest-sage/90 text-white"
            >
              Mark as Completed
            </Button>
            <p className="text-xs text-center text-harvest-charcoal/60 mt-2">
              Claimed on {formattedClaimedDate}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

interface CompletedDonationCardProps {
  donation: {
    id: string;
    foodName: string;
    description: string;
    quantity: string;
    location: string;
    createdAt: string;
    completedAt?: string;
  };
}

const CompletedDonationCard: React.FC<CompletedDonationCardProps> = ({ donation }) => {
  const formattedCompletedDate = donation.completedAt
    ? new Date(donation.completedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';
  
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
              <Badge className="bg-green-100 text-green-700 border-green-200">
                Completed
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
            </div>
          </div>
          
          <div className="p-4 bg-harvest-sage/5 border-t border-harvest-sage/10">
            <Button 
              variant="outline"
              className="w-full border-harvest-sage/40 text-harvest-charcoal hover:bg-harvest-sage/10"
            >
              Write Testimonial
            </Button>
            <p className="text-xs text-center text-harvest-charcoal/60 mt-2">
              Completed on {formattedCompletedDate}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default VolunteerDashboard;
