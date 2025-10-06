-- Add position columns to family_members for persistent tree layout
ALTER TABLE family_members
ADD COLUMN tree_position_x integer,
ADD COLUMN tree_position_y integer;