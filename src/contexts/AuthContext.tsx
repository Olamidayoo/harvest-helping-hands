
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, getCurrentUser } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthContextType = {
  session: Session | null;
  user: User | null;
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
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRoleState] = useState<'donor' | 'volunteer' | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Get user role from local storage
      const storedRole = localStorage.getItem('userRole') as 'donor' | 'volunteer' | null;
      setUserRoleState(storedRole);
      
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const setUserRole = async (role: 'donor' | 'volunteer') => {
    setUserRoleState(role);
    localStorage.setItem('userRole', role);

    // Store in user metadata if user is logged in
    if (user) {
      await supabase.auth.updateUser({
        data: { role }
      });
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      return { data, error };
    },
    signUp: async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signUp({ email, password });
      return { data, error };
    },
    signOut: async () => {
      await supabase.auth.signOut();
      localStorage.removeItem('userRole');
      setUserRoleState(null);
    },
    userRole,
    setUserRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
