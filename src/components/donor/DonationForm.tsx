
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Clock, Package, Phone, Send, Image } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { createDonation } from '@/lib/supabase';
import { supabase } from '@/lib/supabase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const donationSchema = z.object({
  foodName: z.string().min(1, 'Food name is required'),
  description: z.string().min(1, 'Description is required'),
  quantity: z.string().min(1, 'Quantity is required'),
  location: z.string().min(1, 'Location is required'),
  expiryDate: z.string().optional(),
  availableTime: z.string().optional(),
  contactName: z.string().min(1, 'Contact name is required'),
  contactPhone: z.string().min(1, 'Contact phone is required')
});

type FormData = z.infer<typeof donationSchema>;

const DonationForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      foodName: '',
      description: '',
      quantity: '',
      location: '',
      expiryDate: '',
      availableTime: '',
      contactName: '',
      contactPhone: ''
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }
    
    setImageFile(file);
  };

  const onSubmit = async (data: FormData) => {
    if (!user) {
      toast({
        title: "Not authenticated",
        description: "You need to be logged in to make a donation.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    setUploading(true);
    
    try {
      let imageUrl = null;
      
      if (imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('donations')
          .upload(filePath, imageFile);
          
        if (uploadError) throw uploadError;
        
        const { data: urlData } = supabase.storage
          .from('donations')
          .getPublicUrl(filePath);
          
        imageUrl = urlData.publicUrl;
      }
      
      const donationData = {
        donor_id: user.id,
        food_name: data.foodName,
        description: data.description,
        quantity: data.quantity,
        location: data.location,
        expiry_date: data.expiryDate || null,
        available_time: data.availableTime || null,
        contact_name: data.contactName,
        contact_phone: data.contactPhone,
        status: 'pending',
        image_url: imageUrl
      };
      
      const { error } = await createDonation(donationData);
      
      if (error) throw error;
      
      toast({
        title: "Donation submitted!",
        description: "Volunteers will be notified of your generous donation.",
      });
      
      form.reset();
      setImageFile(null);
      
    } catch (error: any) {
      toast({
        title: "Submission failed",
        description: error.message || "There was an error submitting your donation.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass">
      <CardContent className="pt-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <h2 className="text-2xl font-semibold text-harvest-charcoal mb-4">Donate Food</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="foodName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Food Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Package className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input {...field} className="pl-10" placeholder="e.g., Fresh Vegetables" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Package className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input {...field} className="pl-10" placeholder="e.g., 5 kg or 3 meals" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} placeholder="Briefly describe the food items" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input {...field} className="pl-10" placeholder="Full address" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (if applicable)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input {...field} type="date" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="availableTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Available Pickup Time</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input {...field} type="time" className="pl-10" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Your name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-harvest-sage absolute left-3 top-1/2 transform -translate-y-1/2" />
                          <Input {...field} type="tel" className="pl-10" placeholder="Your phone number" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="image">Food Image (Optional)</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="w-full"
                  />
                  {imageFile && (
                    <Image className="h-6 w-6 text-harvest-sage" />
                  )}
                </div>
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
            </form>
          </Form>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default DonationForm;
