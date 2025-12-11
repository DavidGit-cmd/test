-- Create mottakskontroll table for cars sent for signing
CREATE TABLE public.mottakskontroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Car info
  registration_number TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  
  -- Seller info
  seller_name TEXT,
  
  -- Status
  sent_date TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Venter på mottakskontroll',
  
  -- Mottakskontroll checklist data (stored as JSON)
  mottakskontroll_data JSONB DEFAULT NULL,
  
  -- Link to original lead (optional)
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE public.mottakskontroll ENABLE ROW LEVEL SECURITY;

-- Create policies (internal app - allow all operations)
CREATE POLICY "Anyone can view mottakskontroll" 
ON public.mottakskontroll 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create mottakskontroll" 
ON public.mottakskontroll 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update mottakskontroll" 
ON public.mottakskontroll 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete mottakskontroll" 
ON public.mottakskontroll 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mottakskontroll_updated_at
BEFORE UPDATE ON public.mottakskontroll
FOR EACH ROW
EXECUTE FUNCTION public.update_leads_updated_at();