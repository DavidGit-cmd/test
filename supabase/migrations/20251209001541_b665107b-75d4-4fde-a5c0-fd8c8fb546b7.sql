-- Create storage bucket for agreement PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('agreement-pdfs', 'agreement-pdfs', true)
ON CONFLICT (id) DO NOTHING;

-- Add column to mottakskontroll for storing the agreement PDF path
ALTER TABLE public.mottakskontroll 
ADD COLUMN IF NOT EXISTS agreement_pdf_path TEXT;

-- Create storage policies for the bucket
CREATE POLICY "Anyone can view agreement PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'agreement-pdfs');

CREATE POLICY "Anyone can upload agreement PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'agreement-pdfs');

CREATE POLICY "Anyone can update agreement PDFs"
ON storage.objects FOR UPDATE
USING (bucket_id = 'agreement-pdfs');

CREATE POLICY "Anyone can delete agreement PDFs"
ON storage.objects FOR DELETE
USING (bucket_id = 'agreement-pdfs');