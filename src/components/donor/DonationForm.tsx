import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Package, Phone, Send } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { createDonation } from '@/lib/supabase';

interface FormData {
  foodName: string;
  description: string;
  quantity: string;
  location: string;
  expiryDate: string;
  availableTime: string;
  contactName: string;
  contactPhone: string;
}

const initialFormData: FormData = {
  foodName: '',
  description: '',
  quantity: '',
  location: '',
  expiryDate: '',
  availableTime: '',
  contactName: '',
  contactPhone: ''
};

const DonationForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to make a donation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare donation data for Supabase
      const donationData = {
        donor_id: user.id,
        food_name: formData.foodName,
        description: formData.description,
        quantity: formData.quantity,
        location: formData.location,
        expiry_date: formData.expiryDate || null,
        available_time: formData.availableTime || null,
        contact_name: formData.contactName,
        contact_phone: formData.contactPhone,
        status: 'pending',
      };
      
      const { data, error } = await createDonation(donationData);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Donation submitted!",
        description: "Volunteers will be notified of your generous donation.",
      });
      
      // Reset form
      setFormData(initialFormData);
      
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your donation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formFields = [
    { name: 'foodName', label: 'Food Name', placeholder: 'e.g., Fresh Vegetables', icon: Package, type: 'text' },
    { name: 'description', label: 'Description', placeholder: 'Briefly describe the food items', icon: null, type: 'textarea' },
    { name: 'quantity', label: 'Quantity', placeholder: 'e.g., 5 kg or 3 meals', icon: Package, type: 'text' },
    { name: 'location', label: 'Pickup Location', placeholder: 'Full address', icon: MapPin, type: 'text' },
    { name: 'expiryDate', label: 'Expiry Date (if applicable)', placeholder: '', icon: Calendar, type: 'date' },
    { name: 'availableTime', label: 'Available Pickup Time', placeholder: '', icon: Clock, type: 'time' },
    { name: 'contactName', label: 'Contact Name', placeholder: 'Your name', icon: null, type: 'text' },
    { name: 'contactPhone', label: 'Contact Phone', placeholder: 'Your phone number', icon: Phone, type: 'tel' },
  ];
  
  return (
    <Card className="w-full max-w-2xl mx-auto glass">
      <CardContent className="pt-6">
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-harvest-charcoal mb-4">Donate Food</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {formFields.map((field) => (
              <div key={field.name} className={field.name === 'description' ? 'md:col-span-2' : ''}>
                <Label htmlFor={field.name} className="block text-sm font-medium text-harvest-charcoal mb-1">
                  {field.label}
                </Label>
                <div className="relative">
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full pl-3 pr-3 py-2 rounded-md border-harvest-sage border-opacity-30 focus:border-harvest-sage focus:ring focus:ring-harvest-sage focus:ring-opacity-30"
                      rows={3}
                    />
                  ) : (
                    <div className="flex items-center">
                      {field.icon && <field.icon className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />}
                      <Input
                        id={field.name}
                        name={field.name}
                        type={field.type}
                        value={formData[field.name as keyof FormData]}
                        onChange={handleChange}
                        placeholder={field.placeholder}
                        className={`w-full ${field.icon ? 'pl-10' : 'pl-3'} pr-3 py-2 rounded-md border-harvest-sage border-opacity-30 focus:border-harvest-sage focus:ring focus:ring-harvest-sage focus:ring-opacity-30`}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="group relative overflow-hidden bg-harvest-sage hover:bg-harvest-sage/90 text-white px-6 py-2 rounded-md shadow-sm transition-all duration-300"
            >
              <motion.span
                initial={{ x: 0 }}
                animate={isSubmitting ? { x: -40 } : { x: 0 }}
                className="flex items-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : (
                  <>
                    <span>Submit Donation</span>
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </motion.span>
            </Button>
          </div>
        </motion.form>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
