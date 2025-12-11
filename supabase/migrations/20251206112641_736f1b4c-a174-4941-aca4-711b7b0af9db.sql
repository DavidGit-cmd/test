-- Create leads table for car purchase leads
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Basic info
  image_url TEXT,
  registration_number TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year INTEGER,
  price NUMERIC,
  mileage INTEGER,
  fuel TEXT,
  transmission TEXT,
  
  -- Owner info
  owner_name TEXT,
  owner_address TEXT,
  owner_phone TEXT,
  
  -- Finn.no link
  finn_url TEXT,
  
  -- Features and reasons (stored as JSON arrays)
  features JSONB DEFAULT '[]'::jsonb,
  reasons JSONB DEFAULT '[]'::jsonb,
  
  -- Specifications
  omregistrering TEXT,
  pris_excl_omreg TEXT,
  modell_year TEXT,
  karosseri TEXT,
  effekt TEXT,
  slagvolum TEXT,
  co2_utslipp TEXT,
  maksimal_tilhengervekt TEXT,
  hjuldrift TEXT,
  vekt TEXT,
  seter TEXT,
  dorer TEXT,
  bagasjerom TEXT,
  farge TEXT,
  bilen_star_i TEXT,
  sist_eu_godkjent TEXT,
  neste_eu_kontroll TEXT,
  avgiftsklasse TEXT,
  chassis_nr TEXT,
  forste_gang_registrert TEXT,
  salgsform TEXT
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies (internal app - allow all operations)
CREATE POLICY "Anyone can view leads" 
ON public.leads 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update leads" 
ON public.leads 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete leads" 
ON public.leads 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_leads_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON public.leads
FOR EACH ROW
EXECUTE FUNCTION public.update_leads_updated_at();