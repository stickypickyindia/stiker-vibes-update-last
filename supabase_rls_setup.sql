-- ============================================================
-- STICKYPICKY SUPABASE ROW LEVEL SECURITY (RLS) POLICIES
-- Execute this SQL script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ============================================================

-- 1. ENABLE RLS ON ALL STORE TABLES
ALTER TABLE IF EXISTS public.sv_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sv_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sv_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.sv_orders ENABLE ROW LEVEL SECURITY;

-- 2. PUBLIC ACCESS POLICIES (Allow web app & admin client to manage tables)
DROP POLICY IF EXISTS "Public read products" ON public.sv_products;
CREATE POLICY "Public read products" ON public.sv_products FOR SELECT USING (true);
CREATE POLICY "Public insert products" ON public.sv_products FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update products" ON public.sv_products FOR UPDATE USING (true);
CREATE POLICY "Public delete products" ON public.sv_products FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read banners" ON public.sv_banners;
CREATE POLICY "Public read banners" ON public.sv_banners FOR SELECT USING (true);
CREATE POLICY "Public insert banners" ON public.sv_banners FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update banners" ON public.sv_banners FOR UPDATE USING (true);
CREATE POLICY "Public delete banners" ON public.sv_banners FOR DELETE USING (true);

DROP POLICY IF EXISTS "Public read config" ON public.sv_config;
CREATE POLICY "Public read config" ON public.sv_config FOR SELECT USING (true);
CREATE POLICY "Public update config" ON public.sv_config FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public read orders" ON public.sv_orders;
CREATE POLICY "Public read orders" ON public.sv_orders FOR SELECT USING (true);
CREATE POLICY "Public insert orders" ON public.sv_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update orders" ON public.sv_orders FOR UPDATE USING (true);
CREATE POLICY "Public delete orders" ON public.sv_orders FOR DELETE USING (true);

