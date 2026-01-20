-- Migration: Add is_foil column to collection table
-- This allows users to mark cards as foil and display the correct foil pricing

-- Add is_foil column to collection table
ALTER TABLE collection 
ADD COLUMN IF NOT EXISTS is_foil BOOLEAN DEFAULT FALSE;

-- Add comment to document the column
COMMENT ON COLUMN collection.is_foil IS 'Indicates if the card is a foil version for pricing purposes';

-- Create index for better query performance when filtering by foil status
CREATE INDEX IF NOT EXISTS idx_collection_is_foil ON collection(is_foil);
