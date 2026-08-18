CREATE TABLE public.site_posts (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('announcement','activity','success')),
  title text not null,
  body text,
  image_path text,
  event_date date,
  published boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

GRANT SELECT ON public.site_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_posts TO authenticated;
GRANT ALL ON public.site_posts TO service_role;

ALTER TABLE public.site_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published posts" ON public.site_posts FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Admins can view all posts" ON public.site_posts FOR SELECT TO authenticated USING (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can insert posts" ON public.site_posts FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update posts" ON public.site_posts FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete posts" ON public.site_posts FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER site_posts_set_updated_at BEFORE UPDATE ON public.site_posts
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE POLICY "Anyone can read site media" ON storage.objects FOR SELECT TO anon, authenticated USING (bucket_id = 'site-media');
CREATE POLICY "Admins can upload site media" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can update site media" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));
CREATE POLICY "Admins can delete site media" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'site-media' AND public.has_role(auth.uid(),'admin'));