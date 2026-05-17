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

-- Storage bucket: run in Supabase Dashboard > Storage > New Bucket > "product-images" (public)
-- Or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true) ON CONFLICT DO NOTHING;

-- Enable realtime on orders table (Dashboard > Database > Replication > orders)
