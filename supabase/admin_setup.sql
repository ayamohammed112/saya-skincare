-- Run this in your Supabase SQL Editor

-- discount_codes
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  value NUMERIC NOT NULL,
  expiry_date DATE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- order_notes
CREATE TABLE IF NOT EXISTS public.order_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT NOT NULL,
  note TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- skin_quiz_results
CREATE TABLE IF NOT EXISTS public.skin_quiz_results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  skin_type TEXT NOT NULL UNIQUE,
  count INTEGER DEFAULT 0
);

-- inventory_alerts
CREATE TABLE IF NOT EXISTS public.inventory_alerts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id TEXT NOT NULL,
  low_stock_threshold INTEGER NOT NULL DEFAULT 3
);

-- Seed skin quiz types
INSERT INTO public.skin_quiz_results (skin_type, count) VALUES
  ('جافة', 0), ('دهنية', 0), ('مختلطة', 0), ('حساسة', 0), ('عادية', 0)
ON CONFLICT (skin_type) DO NOTHING;

-- Seed default discount code
INSERT INTO public.discount_codes (code, type, value, active)
VALUES ('SAYA10', 'percentage', 10, true)
ON CONFLICT (code) DO NOTHING;

-- ============================================================
-- Admin write permissions (required for admin panel to save data)
-- Run these if INSERT/DELETE from the admin panel fails
-- ============================================================

-- Allow admin panel to add/delete products
CREATE POLICY "admin_insert_products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_delete_products" ON public.products FOR DELETE USING (true);

-- Allow admin panel to add/delete bundles
CREATE POLICY "admin_insert_bundles" ON public.bundles FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_delete_bundles" ON public.bundles FOR DELETE USING (true);

-- description column for bundles (added for admin bundles page)
ALTER TABLE public.bundles ADD COLUMN IF NOT EXISTS description TEXT;

-- name column for products (admin inserts use 'name', schema uses 'name_ar')
-- Run whichever matches your actual table:
--   If your table has name_ar but not name:
--     ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name TEXT;
--   If your table has name but not name_ar:
--     ALTER TABLE public.products ADD COLUMN IF NOT EXISTS name_ar TEXT;

-- Storage bucket: run in Supabase Dashboard > Storage > New Bucket > "product-images" (public)
-- Or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

-- Enable realtime on orders table (Dashboard > Database > Replication > orders)

-- product_sizes: per-product size options managed via admin panel
CREATE TABLE IF NOT EXISTS public.product_sizes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.product_sizes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read_product_sizes" ON public.product_sizes FOR SELECT USING (true);
