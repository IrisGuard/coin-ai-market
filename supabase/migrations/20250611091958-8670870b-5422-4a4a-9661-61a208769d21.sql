
-- Add site_url column to ai_commands table
ALTER TABLE public.ai_commands 
ADD COLUMN IF NOT EXISTS site_url text;

-- Add comment for documentation
COMMENT ON COLUMN public.ai_commands.site_url IS 'Optional website URL for parsing/analysis during command execution';
