-- Create storage bucket for vask/foto media
INSERT INTO storage.buckets (id, name, public) VALUES ('vask-foto-media', 'vask-foto-media', true);

-- Create policies for vask-foto-media bucket
CREATE POLICY "Anyone can view vask-foto media" ON storage.objects FOR SELECT USING (bucket_id = 'vask-foto-media');
CREATE POLICY "Anyone can upload vask-foto media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'vask-foto-media');
CREATE POLICY "Anyone can update vask-foto media" ON storage.objects FOR UPDATE USING (bucket_id = 'vask-foto-media');
CREATE POLICY "Anyone can delete vask-foto media" ON storage.objects FOR DELETE USING (bucket_id = 'vask-foto-media');

-- Add column to track vask/foto data and status
ALTER TABLE public.mottakskontroll ADD COLUMN vask_foto_data jsonb DEFAULT NULL;
ALTER TABLE public.mottakskontroll ADD COLUMN vask_foto_completed boolean DEFAULT false;