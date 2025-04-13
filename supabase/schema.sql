
-- Create donations table
CREATE TABLE IF NOT EXISTS public.donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_id UUID REFERENCES auth.users(id),
  volunteer_id UUID REFERENCES auth.users(id),
  food_name TEXT NOT NULL,
  description TEXT,
  quantity TEXT NOT NULL,
  location TEXT NOT NULL,
  expiry_date TEXT,
  available_time TEXT,
  contact_name TEXT NOT NULL,
  contact_phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

-- Policies for donations
CREATE POLICY "Donors can view their own donations" 
ON public.donations FOR SELECT 
TO authenticated 
USING (auth.uid() = donor_id);

CREATE POLICY "Volunteers can view pending donations" 
ON public.donations FOR SELECT 
TO authenticated 
USING (status = 'pending');

CREATE POLICY "Volunteers can view their accepted donations" 
ON public.donations FOR SELECT 
TO authenticated 
USING (auth.uid() = volunteer_id);

CREATE POLICY "Donors can insert their own donations" 
ON public.donations FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = donor_id);

CREATE POLICY "Donors can update their own donations" 
ON public.donations FOR UPDATE 
TO authenticated 
USING (auth.uid() = donor_id);

CREATE POLICY "Volunteers can update donations they accepted" 
ON public.donations FOR UPDATE 
TO authenticated 
USING (auth.uid() = volunteer_id);

-- Index for performance
CREATE INDEX IF NOT EXISTS donation_donor_id_idx ON public.donations (donor_id);
CREATE INDEX IF NOT EXISTS donation_volunteer_id_idx ON public.donations (volunteer_id);
CREATE INDEX IF NOT EXISTS donation_status_idx ON public.donations (status);
