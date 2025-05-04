
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

// Form schema
const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').optional(),
});

type FormValues = z.infer<typeof formSchema>;

const SignupForm = () => {
  const { signUp, setUserRole } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'donor' | 'volunteer'>('donor');
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log('Signing up with:', values.email);
      
      const { error } = await signUp(values.email, values.password);
      
      if (error) {
        console.error('Signup error:', error);
        
        if (error.message.includes('already registered')) {
          toast({
            title: 'Account already exists',
            description: 'This email is already registered. Please log in instead.',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Signup failed',
            description: error.message || 'An unexpected error occurred',
            variant: 'destructive',
          });
        }
        return;
      }
      
      // Store the user role - this will get applied when the session is established
      await setUserRole(activeTab);
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully.',
      });
      
      // Automatically redirect to login page
      navigate('/login', { 
        state: { 
          message: 'Please log in with your new account.',
          role: activeTab
        } 
      });
      
    } catch (error: any) {
      console.error('Unexpected error during signup:', error);
      toast({
        title: 'Signup failed',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md mx-auto glass">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-harvest-charcoal">
            Create an Account
          </CardTitle>
          <CardDescription className="text-center">
            Join us in reducing food waste and helping communities
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as 'donor' | 'volunteer')}
            className="w-full pb-4"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="donor" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                Join as a Donor
              </TabsTrigger>
              <TabsTrigger value="volunteer" className="data-[state=active]:bg-harvest-sage data-[state=active]:text-white">
                Join as a Volunteer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="donor" className="mt-4">
              <p className="text-sm text-harvest-charcoal/70 mb-4">
                As a donor, you can list excess food that would otherwise go to waste.
              </p>
            </TabsContent>
            <TabsContent value="volunteer" className="mt-4">
              <p className="text-sm text-harvest-charcoal/70 mb-4">
                As a volunteer, you can pick up and distribute food to those in need.
              </p>
            </TabsContent>
          </Tabs>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your email" 
                        {...field} 
                        autoComplete="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username (optional)</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Choose a username" 
                        {...field} 
                        autoComplete="username"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Create a password" 
                        {...field} 
                        autoComplete="new-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-harvest-sage hover:bg-harvest-sage/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating Account...' : 'Sign Up'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-harvest-charcoal/70 w-full">
            Already have an account?{' '}
            <Link to="/login" className="text-harvest-sage hover:underline font-medium">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SignupForm;
