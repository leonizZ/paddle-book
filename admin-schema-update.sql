-- Update Courts table to include tags and hourly_rate
ALTER TABLE courts 
ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS hourly_rate DECIMAL(10, 2) DEFAULT 20.00;

-- Update existing courts with some default data
UPDATE courts 
SET tags = ARRAY['Indoor', 'Premium', 'AC'] 
WHERE name = 'Court 1';

UPDATE courts 
SET tags = ARRAY['Outdoor', 'Recreational'] 
WHERE name = 'Court 2';

-- Ensure bookings table can handle 'maintenance' status
-- (The existing check constraint might need updating if it exists, 
-- but the schema showed just a VARCHAR default, so we should be good.
-- Let's just add a comment or check if we need to do anything.)
-- The existing schema has: status VARCHAR(20) DEFAULT 'confirmed'
-- We will use 'maintenance' for blocked slots.
