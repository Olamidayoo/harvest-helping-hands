
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const LoginForm = () => {
  const { signIn, setUserRole } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'donor' | 'volunteer'>('donor');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.error("Login error:", error);
        toast({
          title: "Login failed",
          description: error.message || "Invalid email or password",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      
      console.log("Login successful, setting role:", role);
      // Set user role
      await setUserRole(role);
      
      toast({
        title: "Login successful",
        description: `Welcome back to FoodDrop!`,
      });
      
      // Navigate to the appropriate dashboard
      navigate(`/${role}`);
      
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during login",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto glass">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold text-fooddrop-charcoal">Login</CardTitle>
        <CardDescription>Enter your email and password to access your account</CardDescription>
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-fooddrop-charcoal/50 h-4 w-4" />
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
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-fooddrop-charcoal/50 h-4 w-4" />
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
            <Label>I want to login as</Label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                type="button"
                variant={role === 'donor' ? 'default' : 'outline'}
                className={role === 'donor' ? 'bg-fooddrop-sage' : 'border-fooddrop-sage/50'}
                onClick={() => setRole('donor')}
              >
                Donor
              </Button>
              <Button
                type="button"
                variant={role === 'volunteer' ? 'default' : 'outline'}
                className={role === 'volunteer' ? 'bg-fooddrop-sage' : 'border-fooddrop-sage/50'}
                onClick={() => setRole('volunteer')}
              >
                Volunteer
              </Button>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-fooddrop-sage hover:bg-fooddrop-sage/90"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </motion.form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-fooddrop-charcoal/70">
          Don't have an account yet?{' '}
          <Button variant="link" className="p-0 h-auto text-fooddrop-sage" onClick={() => navigate('/signup')}>
            Sign up
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
