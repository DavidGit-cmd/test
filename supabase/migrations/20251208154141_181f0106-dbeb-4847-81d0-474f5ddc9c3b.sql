-- Add tilstandskontroll_data column to store the inspection data
ALTER TABLE public.mottakskontroll 
ADD COLUMN tilstandskontroll_data jsonb DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN public.mottakskontroll.tilstandskontroll_data IS 'Stores the complete tilstandskontroll inspection form data';