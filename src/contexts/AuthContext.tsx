
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';
import { useToast } from "@/components/ui/use-toast";

type Profile = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
};

type AuthContextType = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any;
    data?: any;
  }>;
  signUp: (email: string, password: string) => Promise<{
    error: any;
    data?: any;
  }>;
  signOut: () => Promise<void>;
  userRole: 'donor' | 'volunteer' | null;
  setUserRole: (role: 'donor' | 'volunteer') => Promise<void>;
  updateUsername: (username: string) => Promise<{
    error: any | null;
    data?: any;
  }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRoleState] = useState<'donor' | 'volunteer' | null>(null);
  const { toast } = useToast();

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return;
      }
      
      if (data) {
        setProfile(data as Profile);
      }
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST (to prevent missing auth events)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const userMetaRole = session.user.user_metadata?.role as 'donor' | 'volunteer' | null;
        if (userMetaRole) {
          setUserRoleState(userMetaRole);
          localStorage.setItem('userRole', userMetaRole);
        }
        
        // Fetch user profile on auth state change
        fetchUserProfile(session.user.id);
      } else {
        // Clear profile when logged out
        setProfile(null);
      }
      
      setLoading(false);
    });

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Initial session check:", session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      // Get user role from user metadata or local storage
      if (session?.user) {
        const userMetaRole = session.user.user_metadata?.role as 'donor' | 'volunteer' | null;
        if (userMetaRole) {
          setUserRoleState(userMetaRole);
          localStorage.setItem('userRole', userMetaRole);
        } else {
          // Fallback to local storage
          const storedRole = localStorage.getItem('userRole') as 'donor' | 'volunteer' | null;
          setUserRoleState(storedRole);
          
          // Update metadata if we have a role in local storage but not in metadata
          if (storedRole) {
            supabase.auth.updateUser({
              data: { role: storedRole }
            }).catch(error => {
              console.error("Error updating user metadata:", error);
            });
          }
        }

        // Fetch user profile
        fetchUserProfile(session.user.id);
      } else {
        // No active session, check local storage as fallback
        const storedRole = localStorage.getItem('userRole') as 'donor' | 'volunteer' | null;
        setUserRoleState(storedRole);
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setUserRole = async (role: 'donor' | 'volunteer') => {
    setUserRoleState(role);
    localStorage.setItem('userRole', role);

    // Store in user metadata if user is logged in
    if (user) {
      try {
        await supabase.auth.updateUser({
          data: { role }
        });
      } catch (error: any) {
        toast({
          title: "Error updating user role",
          description: error.message || "Failed to update your role",
          variant: "destructive"
        });
      }
    }
  };

  const updateUsername = async (username: string) => {
    if (!user) {
      return { error: new Error('User not authenticated'), data: undefined };
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ username, updated_at: new Date() })
        .eq('id', user.id)
        .select();

      if (error) {
        toast({
          title: "Error updating username",
          description: error.message,
          variant: "destructive"
        });
        return { error, data: undefined };
      }

      if (data && data.length > 0) {
        setProfile(data[0] as Profile);
        toast({
          title: "Username updated",
          description: "Your username has been successfully updated"
        });
      }

      return { data, error: null };
    } catch (error: any) {
      toast({
        title: "Error updating username",
        description: error.message || "Failed to update username",
        variant: "destructive"
      });
      return { error, data: undefined };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      console.log("Signing in with:", email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      console.log("Sign in result:", data?.user?.id, error);
      
      if (error) return { error, data: undefined };
      return { data, error: null };
    } catch (error) {
      console.error("Error in signIn function:", error);
      return { error, data: undefined };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      console.log("Signing up with:", email);
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin + '/login'
        }
      });
      console.log("Sign up result:", data?.user?.id, error);
      
      if (error) return { error, data: undefined };
      return { data, error: null };
    } catch (error) {
      console.error("Error in signUp function:", error);
      return { error, data: undefined };
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut: async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('userRole');
      setUserRoleState(null);
      setProfile(null);
    },
    userRole,
    setUserRole,
    updateUsername,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
