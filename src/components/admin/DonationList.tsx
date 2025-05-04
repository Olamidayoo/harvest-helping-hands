import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Package, MapPin, Clock, User, Phone, Calendar, Trash, Filter, ChevronDown, ChevronUp, LayoutGrid, LayoutList, Search } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { format } from 'date-fns';
import { Input } from '@/components/ui/input';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewType, setViewType] = useState('grid'); // 'grid' or 'table'
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'completed'
  const [sortKey, setSortKey] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, [filter]);

  const fetchDonations = async () => {
    try {
      // Create query builder
      let query = supabase
        .from('donations')
        .select(`
          *
        `);

      // Apply filter if not 'all'
      if (filter !== 'all') {
        query = query.eq('status', filter);
      }

      // Execute query with ordering
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      console.log("Fetched donations:", data);
      
      // Fetch donor information separately
      if (data && data.length > 0) {
        const donorIds = data.map(donation => donation.donor_id).filter(Boolean);
        if (donorIds.length > 0) {
          const { data: donorsData, error: donorsError } = await supabase
            .from('profiles')
            .select('id, username')
            .in('id', donorIds);
            
          if (!donorsError && donorsData) {
            const donorsMap = {};
            donorsData.forEach(donor => {
              donorsMap[donor.id] = donor;
            });
            
            // Attach donor info to donations
            const enhancedDonations = data.map(donation => ({
              ...donation,
              donor: donation.donor_id ? donorsMap[donation.donor_id] : null
            }));
            
            setDonations(enhancedDonations);
          } else {
            setDonations(data);
          }
        } else {
          setDonations(data);
        }
      } else {
        setDonations(data || []);
      }
    } catch (error) {
      console.error('Error fetching donations:', error);
      toast({
        title: "Error fetching donations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (donationId, newStatus) => {
    try {
      const { error } = await supabase
        .from('donations')
        .update({ status: newStatus })
        .eq('id', donationId);

      if (error) throw error;

      toast({
        title: "Status updated",
        description: "Donation status has been updated successfully"
      });

      fetchDonations();
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleDeleteDonation = async (donationId) => {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', donationId);

      if (error) throw error;

      toast({
        title: "Donation deleted",
        description: "Donation has been removed successfully"
      });

      fetchDonations();
    } catch (error) {
      toast({
        title: "Error deleting donation",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch (e) {
      return dateStr;
    }
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };
  
  const sortedDonations = [...donations].sort((a, b) => {
    let valA = a[sortKey];
    let valB = b[sortKey];
    
    if (typeof valA === 'string') {
      valA = valA.toLowerCase();
      valB = valB.toLowerCase();
    }
    
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const filteredDonations = sortedDonations.filter(donation => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (donation.food_name && donation.food_name.toLowerCase().includes(searchLower)) ||
      (donation.description && donation.description.toLowerCase().includes(searchLower)) ||
      (donation.location && donation.location.toLowerCase().includes(searchLower)) ||
      (donation.donor?.username && donation.donor.username.toLowerCase().includes(searchLower))
    );
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-harvest-sage"></div>
        <span className="ml-2 text-harvest-sage">Loading donations...</span>
      </div>
    );
  }

  const SortIcon = ({ field }) => {
    if (sortKey !== field) return null;
    return sortDirection === 'asc' ? 
      <ChevronUp className="inline-block w-4 h-4" /> : 
      <ChevronDown className="inline-block w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-harvest-charcoal mb-1">Donation Management</h2>
          <p className="text-harvest-charcoal/70 text-sm">View and manage all food donations</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-harvest-charcoal/40" />
            <Input 
              placeholder="Search donations..." 
              className="pl-8 bg-white/50 border-harvest-sage/30 focus:border-harvest-sage" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-full sm:w-[160px] bg-white/50 border-harvest-sage/30">
              <Filter className="h-4 w-4 mr-2 opacity-70" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Donations</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          
          <ToggleGroup type="single" value={viewType} onValueChange={(value) => value && setViewType(value)}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <LayoutGrid className="h-4 w-4 mr-1" /> Grid
            </ToggleGroupItem>
            <ToggleGroupItem value="table" aria-label="Table view">
              <LayoutList className="h-4 w-4 mr-1" /> Table
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {filteredDonations.length === 0 ? (
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <p className="text-harvest-charcoal/70">No donations found.</p>
          </CardContent>
        </Card>
      ) : viewType === 'grid' ? (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredDonations.map((donation) => (
            <Card key={donation.id} className="glass overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="p-0">
                {donation.image_url && (
                  <div className="relative w-full">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={donation.image_url} 
                        alt={donation.food_name}
                        className="w-full h-full object-cover"
                      />
                    </AspectRatio>
                    <Badge className={`absolute top-2 right-2 ${getStatusColor(donation.status)} border px-2 py-1`}>
                      {donation.status}
                    </Badge>
                  </div>
                )}
                <div className="p-6">
                  {!donation.image_url && (
                    <div className="flex justify-between mb-2">
                      <Badge className={`${getStatusColor(donation.status)} border`}>{donation.status}</Badge>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-xl font-medium text-harvest-charcoal">{donation.food_name}</h3>
                    <p className="text-sm text-harvest-charcoal/70 line-clamp-2 mt-1">{donation.description}</p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 mt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <Package className="w-4 h-4 text-harvest-sage mr-2" />
                        <span>{donation.quantity}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 text-harvest-sage mr-2" />
                        <span className="truncate">{donation.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 text-harvest-sage mr-2" />
                        <span>{formatDate(donation.created_at)}</span>
                      </div>
                      <div className="flex items-center">
                        <User className="w-4 h-4 text-harvest-sage mr-2" />
                        <span>{donation.donor?.username || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 text-harvest-sage mr-2" />
                        <span className="truncate">{donation.contact_name} ({donation.contact_phone})</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Select
                      value={donation.status}
                      onValueChange={(value) => handleStatusChange(donation.id, value)}
                    >
                      <SelectTrigger className="bg-white/50">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="default"
                          className="bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          <Trash className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the donation. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteDonation(donation.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="glass overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-harvest-sage/10">
                <TableRow>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('food_name')}>
                    Food Item <SortIcon field="food_name" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('donor_id')}>
                    Donor <SortIcon field="donor_id" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('location')}>
                    Location <SortIcon field="location" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('created_at')}>
                    Date <SortIcon field="created_at" />
                  </TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>
                    Status <SortIcon field="status" />
                  </TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDonations.map((donation) => (
                  <TableRow key={donation.id} className="hover:bg-harvest-sage/5">
                    <TableCell className="font-medium">
                      {donation.food_name}
                      <p className="text-xs text-muted-foreground mt-1">{donation.quantity}</p>
                    </TableCell>
                    <TableCell>{donation.donor?.username || 'Anonymous'}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{donation.location}</TableCell>
                    <TableCell>{formatDate(donation.created_at)}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(donation.status)} border`}>{donation.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Select
                          value={donation.status}
                          onValueChange={(value) => handleStatusChange(donation.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[110px] bg-white/50">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8 bg-red-100 text-red-800 hover:bg-red-200"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the donation. This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteDonation(donation.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      <div className="flex justify-between items-center pt-4 border-t border-harvest-sage/10">
        <p className="text-sm text-harvest-charcoal/70">
          Showing {filteredDonations.length} of {donations.length} donations
        </p>
      </div>
    </div>
  );
};

export default DonationList;
