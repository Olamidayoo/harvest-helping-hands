
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const SignupForm = () => {
  const { signUp, setUserRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'volunteer'>('donor');
  const [isLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match",
        variant: "destructive"
      });
      return;
    }
    
    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters long",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log("Attempting signup with:", email);
      const { error, data } = await signUp(email, password);
      
      if (error) {
        console.error("Signup error:", error);
        toast({
          title: "Signup failed",
          description: error.message || "Could not create account",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Signup successful, setting role:", role);
      // Set user role
      await setUserRole(role);
      
      toast({
        title: "Signup successful",
        description: "Your account has been created. Please check your email for verification if required.",
      });
      
      // Navigate to login
      setTimeout(() => {
        navigate('/login');
      }, 1500);
      
    } catch (error: any) {
      console.error("Signup exception:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during signup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-harvest-charcoal">Sign Up</CardTitle>
        <CardDescription>Create an account to start using Harvest</CardDescription>
      </CardHeader>
      <CardContent>
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-harvest-charcoal/50 h-4 w-4" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="username">Username (optional)</Label>
            <Input
              id="username"
              type="text"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-harvest-charcoal/50 h-4 w-4" />
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-harvest-charcoal/50 h-4 w-4" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pl-10"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>I want to register as</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={role === 'donor' ? 'default' : 'outline'}
                className={role === 'donor' ? 'bg-harvest-sage' : 'border-harvest-sage/50'}
                onClick={() => setRole('donor')}
              >
                Donor
              </Button>
              <Button
                type="button"
                variant={role === 'volunteer' ? 'default' : 'outline'}
                className={role === 'volunteer' ? 'bg-harvest-sage' : 'border-harvest-sage/50'}
                onClick={() => setRole('volunteer')}
              >
                Volunteer
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-harvest-sage hover:bg-harvest-sage/90"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : (
              <>
                <UserPlus className="mr-2 h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </motion.form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-harvest-charcoal/70">
          Already have an account?{' '}
          <Button variant="link" className="p-0 h-auto text-harvest-sage" onClick={() => navigate('/login')}>
            Login
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;
