
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabase';
import { Package, MapPin, Clock } from 'lucide-react';

const DonationList = () => {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*, profiles!donations_donor_id_fkey(username)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDonations(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching donations",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (donationId: string, newStatus: string) => {
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
    } catch (error: any) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid gap-4">
      {donations.map((donation: any) => (
        <Card key={donation.id} className="glass">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-medium text-harvest-charcoal">{donation.food_name}</h3>
                <p className="text-sm text-harvest-charcoal/70">{donation.description}</p>
              </div>
              <Badge>{donation.status}</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Package className="w-4 h-4 text-harvest-sage mr-2" />
                  <span>{donation.quantity}</span>
                </div>
                <div className="flex items-center text-sm">
                  <MapPin className="w-4 h-4 text-harvest-sage mr-2" />
                  <span>{donation.location}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-harvest-sage mr-2" />
                  <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm">
                  <strong>Donor:</strong> {donation.profiles?.username || 'Anonymous'}
                </p>
                <p className="text-sm">
                  <strong>Contact:</strong> {donation.contact_name} ({donation.contact_phone})
                </p>
                {donation.image_url && (
                  <img 
                    src={donation.image_url} 
                    alt="Donation" 
                    className="w-32 h-32 object-cover rounded"
                  />
                )}
              </div>
            </div>

            <div className="mt-4 space-x-2">
              <Button 
                size="sm" 
                variant={donation.status === 'pending' ? 'default' : 'outline'}
                onClick={() => handleStatusChange(donation.id, 'pending')}
              >
                Mark Pending
              </Button>
              <Button 
                size="sm" 
                variant={donation.status === 'completed' ? 'default' : 'outline'}
                onClick={() => handleStatusChange(donation.id, 'completed')}
              >
                Mark Completed
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DonationList;
