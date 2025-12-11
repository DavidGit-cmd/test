-- Create a table for car sale announcements
CREATE TABLE public.sale_announcements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_number TEXT NOT NULL,
  car_make TEXT NOT NULL,
  car_model TEXT NOT NULL,
  sold_price NUMERIC NOT NULL,
  extras TEXT,
  total_amount NUMERIC NOT NULL,
  seller_name TEXT NOT NULL,
  buyer_cost NUMERIC,
  profit NUMERIC,
  notes TEXT,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sale_announcements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read announcements (internal team tool)
CREATE POLICY "Anyone can view sale announcements"
ON public.sale_announcements
FOR SELECT
USING (true);

-- Allow anyone to create announcements (internal team tool)
CREATE POLICY "Anyone can create sale announcements"
ON public.sale_announcements
FOR INSERT
WITH CHECK (true);

-- Enable realtime for this table
ALTER PUBLICATION supabase_realtime ADD TABLE public.sale_announcements;