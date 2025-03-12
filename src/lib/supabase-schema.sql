
-- Create the 'donations' table
CREATE TABLE IF NOT EXISTS donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_id UUID NOT NULL REFERENCES auth.users(id),
  volunteer_id UUID REFERENCES auth.users(id),
  food_name VARCHAR(255) NOT NULL,
  description TEXT,
  quantity VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  expiry_date DATE,
  available_time TIME,
  contact_name VARCHAR(255) NOT NULL,
  contact_phone VARCHAR(50) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'accepted', 'completed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies for the donations table

-- Enable RLS on the donations table
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;

-- Policy for donors to view their own donations
CREATE POLICY donor_select_own_donations ON donations
  FOR SELECT
  USING (auth.uid() = donor_id);

-- Policy for donors to insert their own donations
CREATE POLICY donor_insert_own_donations ON donations
  FOR INSERT
  WITH CHECK (auth.uid() = donor_id);

-- Policy for donors to update their own pending donations
CREATE POLICY donor_update_own_pending_donations ON donations
  FOR UPDATE
  USING (auth.uid() = donor_id AND status = 'pending')
  WITH CHECK (auth.uid() = donor_id AND status = 'pending');

-- Policy for volunteers to view available donations
CREATE POLICY volunteer_select_available_donations ON donations
  FOR SELECT
  USING (status = 'pending' OR volunteer_id = auth.uid());

-- Policy for volunteers to update donations they're volunteering for
CREATE POLICY volunteer_update_own_donations ON donations
  FOR UPDATE
  USING (
    (status = 'pending' AND NEW.volunteer_id = auth.uid() AND NEW.status = 'accepted') OR
    (volunteer_id = auth.uid() AND status = 'accepted' AND NEW.status = 'completed')
  );

-- Create an index for faster searches
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
CREATE INDEX IF NOT EXISTS idx_donations_volunteer_id ON donations(volunteer_id);

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON donations
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
