
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Phone, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast";

interface DonationCardProps {
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
  };
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

const DonationCard: React.FC<DonationCardProps> = ({ donation, onAccept, onReject }) => {
  const { toast } = useToast();
  
  const handleAccept = () => {
    toast({
      title: "Donation accepted!",
      description: "You've successfully claimed this donation for pickup.",
    });
    onAccept(donation.id);
  };
  
  const handleReject = () => {
    toast({
      description: "You've declined this donation.",
    });
    onReject(donation.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="h-full glass overflow-hidden border border-harvest-sage/20 hover:border-harvest-sage/40 transition-all duration-300">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-medium text-harvest-charcoal">{donation.foodName}</h3>
            <Badge variant="outline" className="bg-harvest-sage/10 text-harvest-sage border-harvest-sage/30">
              Available
            </Badge>
          </div>
          
          <p className="text-sm text-harvest-charcoal/70 mb-4">{donation.description}</p>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Package className="w-4 h-4 text-harvest-sage mr-2" />
              <span className="text-harvest-charcoal/80">{donation.quantity}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <MapPin className="w-4 h-4 text-harvest-sage mr-2" />
              <span className="text-harvest-charcoal/80">{donation.location}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 text-harvest-sage mr-2" />
              <span className="text-harvest-charcoal/80">
                {donation.expiryDate ? `Expires: ${donation.expiryDate}` : 'No expiry date'}
              </span>
            </div>
            
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-harvest-sage mr-2" />
              <span className="text-harvest-charcoal/80">Available for pickup: {donation.availableTime}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Phone className="w-4 h-4 text-harvest-sage mr-2" />
              <span className="text-harvest-charcoal/80">Contact: {donation.contactName}, {donation.contactPhone}</span>
            </div>
          </div>
        </CardContent>
        
        <CardFooter className="p-4 border-t border-harvest-sage/10 flex justify-between bg-harvest-cream/50">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleReject}
            className="text-harvest-charcoal hover:text-red-500 hover:bg-red-50 border-harvest-sage/20"
          >
            <X className="w-4 h-4 mr-2" />
            Decline
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleAccept}
            className="bg-harvest-sage hover:bg-harvest-sage/90 text-white"
          >
            <Check className="w-4 h-4 mr-2" />
            Accept
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DonationCard;
