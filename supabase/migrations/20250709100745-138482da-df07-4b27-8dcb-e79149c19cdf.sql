-- Create a table to store video information cache
CREATE TABLE IF NOT EXISTS public.video_cache (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  duration TEXT,
  thumbnail TEXT,
  channel_name TEXT,
  published_at TEXT,
  view_count TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.video_cache ENABLE ROW LEVEL SECURITY;

-- Create policy to allow read access to all users
CREATE POLICY "Video cache is viewable by everyone" 
ON public.video_cache 
FOR SELECT 
USING (true);

-- Create policy to allow insert/update for service role
CREATE POLICY "Video cache can be managed by service role" 
ON public.video_cache 
FOR ALL 
USING (true);