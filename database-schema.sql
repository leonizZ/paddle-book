-- Pickleball Court Booking Database Schema

-- Courts table
CREATE TABLE courts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image_url VARCHAR(255),
  status VARCHAR(20) DEFAULT 'active', -- active, maintenance, inactive
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Time slots table (defines available time slots)
CREATE TABLE time_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  court_id UUID NOT NULL REFERENCES courts(id) ON DELETE CASCADE,
  time_slot_id UUID NOT NULL REFERENCES time_slots(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  customer_name VARCHAR(100) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  status VARCHAR(20) DEFAULT 'confirmed', -- confirmed, cancelled, completed
  total_amount DECIMAL(10, 2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(court_id, booking_date, time_slot_id) -- Prevent double booking
);

-- Indexes for better query performance
CREATE INDEX idx_bookings_court_date ON bookings(court_id, booking_date);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_date ON bookings(booking_date);

-- Insert sample courts
INSERT INTO courts (name, description, image_url, status) VALUES
('Court 1', 'Professional blue surface with premium LED lighting. Perfect for competitive play and tournaments.', '/images/court-1.png', 'active'),
('Court 2', 'Vibrant green surface with modern amenities. Ideal for recreational play and training sessions.', '/images/court-2.png', 'active');

-- Insert sample time slots (hourly slots from 6 AM to 10 PM)
INSERT INTO time_slots (start_time, end_time, duration_minutes) VALUES
('06:00:00', '07:00:00', 60),
('07:00:00', '08:00:00', 60),
('08:00:00', '09:00:00', 60),
('09:00:00', '10:00:00', 60),
('10:00:00', '11:00:00', 60),
('11:00:00', '12:00:00', 60),
('12:00:00', '13:00:00', 60),
('13:00:00', '14:00:00', 60),
('14:00:00', '15:00:00', 60),
('15:00:00', '16:00:00', 60),
('16:00:00', '17:00:00', 60),
('17:00:00', '18:00:00', 60),
('18:00:00', '19:00:00', 60),
('19:00:00', '20:00:00', 60),
('20:00:00', '21:00:00', 60),
('21:00:00', '22:00:00', 60);

-- Row Level Security (RLS) Policies
ALTER TABLE courts ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read courts and time slots
CREATE POLICY "Courts are viewable by everyone" ON courts
  FOR SELECT USING (true);

CREATE POLICY "Time slots are viewable by everyone" ON time_slots
  FOR SELECT USING (true);

-- Allow everyone to read bookings (for availability checking)
CREATE POLICY "Bookings are viewable by everyone" ON bookings
  FOR SELECT USING (true);

-- Allow authenticated users to create bookings
CREATE POLICY "Authenticated users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'anon');

-- Allow users to update their own bookings
CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Allow users to delete their own bookings
CREATE POLICY "Users can delete their own bookings" ON bookings
  FOR DELETE USING (auth.uid() = user_id);
