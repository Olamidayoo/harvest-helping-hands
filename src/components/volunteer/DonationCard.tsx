
import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Package, Phone, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DonationCardProps {
  donation: {
    id: string;
    title: string;
    description: string;
    quantity: string;
    location: string;
    expiryDate?: string | null;
    availableTime?: string | null;
    contactName: string;
    contactPhone: string;
    status: string;
    createdAt: string;
  };
  onAccept: ((id: string) => void) | null;
  onComplete: ((id: string) => void) | null;
}

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
      return 'Available';
    case 'accepted':
      return 'Pickup Scheduled';
    case 'completed':
      return 'Completed';
    default:
      return status;
  }
};

const DonationCard: React.FC<DonationCardProps> = ({ donation, onAccept, onComplete }) => {
  const formattedDate = new Date(donation.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const formattedExpiryDate = donation.expiryDate 
    ? new Date(donation.expiryDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;
  
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
              <h3 className="text-xl font-medium text-harvest-charcoal">{donation.title}</h3>
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
              
              {formattedExpiryDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-harvest-sage mr-2" />
                  <span className="text-harvest-charcoal/80">Expires: {formattedExpiryDate}</span>
                </div>
              )}
              
              {donation.availableTime && (
                <div className="flex items-center text-sm">
                  <Clock className="w-4 h-4 text-harvest-sage mr-2" />
                  <span className="text-harvest-charcoal/80">Available at: {donation.availableTime}</span>
                </div>
              )}
              
              <div className="flex items-center text-sm">
                <Phone className="w-4 h-4 text-harvest-sage mr-2" />
                <span className="text-harvest-charcoal/80">Contact: {donation.contactName}, {donation.contactPhone}</span>
              </div>
            </div>
            
            {(onAccept || onComplete) && (
              <div className="mt-4 pt-4 border-t border-harvest-sage/10">
                {onAccept && (
                  <Button 
                    onClick={() => onAccept(donation.id)} 
                    className="w-full bg-harvest-sage hover:bg-harvest-sage/90 text-white"
                  >
                    Accept Donation
                  </Button>
                )}
                
                {onComplete && (
                  <Button 
                    onClick={() => onComplete(donation.id)} 
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="px-6 py-3 bg-harvest-cream/50 text-sm text-harvest-charcoal/70 border-t border-harvest-sage/10">
            Posted on {formattedDate}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DonationCard;
