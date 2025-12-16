-- Add specific_label column to family_members table
ALTER TABLE family_members 
ADD COLUMN specific_label text;

-- Add comment for documentation
COMMENT ON COLUMN family_members.specific_label IS 'Specific child-friendly label like "Dad", "Mom", "Grandma", etc. used for AI chat context';