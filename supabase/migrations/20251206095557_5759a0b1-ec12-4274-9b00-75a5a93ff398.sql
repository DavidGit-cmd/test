-- Create table for announcement likes
CREATE TABLE public.announcement_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.sale_announcements(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(announcement_id, author_name)
);

-- Create table for announcement comments
CREATE TABLE public.announcement_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  announcement_id UUID NOT NULL REFERENCES public.sale_announcements(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.announcement_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcement_comments ENABLE ROW LEVEL SECURITY;

-- RLS policies for likes
CREATE POLICY "Anyone can view likes" ON public.announcement_likes FOR SELECT USING (true);
CREATE POLICY "Anyone can create likes" ON public.announcement_likes FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete their own likes" ON public.announcement_likes FOR DELETE USING (true);

-- RLS policies for comments
CREATE POLICY "Anyone can view comments" ON public.announcement_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can create comments" ON public.announcement_comments FOR INSERT WITH CHECK (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcement_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcement_comments;