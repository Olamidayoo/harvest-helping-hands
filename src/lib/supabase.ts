
import { createClient } from '@supabase/supabase-js';

// Use the values from src/integrations/supabase/client.ts
const SUPABASE_URL = "https://bydjqnetcjgzplbgbhne.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5ZGpxbmV0Y2pnenBsYmdiaG5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3ODI1MjksImV4cCI6MjA1NzM1ODUyOX0.nxVA0mEaQ1MOp-xvbJH5bcybAc1h0ZIlrJyRrWKwq9c";

// Initialize a single supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
};

// Database operations for donations
export const getDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getDonationsByDonor = async (userId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('donor_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getAvailableDonations = async () => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const getDonationsByVolunteer = async (volunteerId: string) => {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('volunteer_id', volunteerId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

export const createDonation = async (donation: any) => {
  const { data, error } = await supabase
    .from('donations')
    .insert([donation])
    .select();
  
  return { data, error };
};

export const updateDonationStatus = async (id: string, status: string, volunteerId?: string) => {
  const updates: any = { status };
  if (volunteerId) {
    updates.volunteer_id = volunteerId;
  }
  
  const { data, error } = await supabase
    .from('donations')
    .update(updates)
    .eq('id', id)
    .select();
  
  return { data, error };
};
