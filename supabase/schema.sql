-- ============================================================
-- Saya Skincare – Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Products
CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  name_ar       TEXT    NOT NULL,
  name_en       TEXT    NOT NULL,
  price         INTEGER NOT NULL,
  original_price INTEGER,
  category      TEXT,
  description_ar TEXT,
  description_en TEXT,
  image_url     TEXT,
  in_stock      BOOLEAN NOT NULL DEFAULT true,
  is_featured   BOOLEAN NOT NULL DEFAULT false,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Orders
CREATE TABLE IF NOT EXISTS orders (
  id                    UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name         TEXT        NOT NULL,
  customer_phone        TEXT        NOT NULL,
  customer_email        TEXT,
  customer_address      TEXT,
  governorate           TEXT,
  payment_method        TEXT        NOT NULL,
  payment_screenshot_url TEXT,
  items                 JSONB       NOT NULL,
  total                 INTEGER     NOT NULL,
  shipping              INTEGER     NOT NULL DEFAULT 0,
  discount              INTEGER     NOT NULL DEFAULT 0,
  status                TEXT        NOT NULL DEFAULT 'pending',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Customers
CREATE TABLE IF NOT EXISTS customers (
  id         UUID        NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  phone      TEXT        NOT NULL UNIQUE,
  name       TEXT,
  email      TEXT,
  points     INTEGER     NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bundles
CREATE TABLE IF NOT EXISTS bundles (
  id               TEXT        NOT NULL PRIMARY KEY,
  name_ar          TEXT        NOT NULL,
  name_en          TEXT        NOT NULL,
  products         JSONB,
  original_price   INTEGER,
  discounted_price INTEGER,
  image_url        TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE products  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders    ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE bundles   ENABLE ROW LEVEL SECURITY;

-- Products & bundles: public read
CREATE POLICY "public_read_products" ON products  FOR SELECT USING (true);
CREATE POLICY "public_read_bundles"  ON bundles   FOR SELECT USING (true);

-- Orders: anyone can insert; no public read (admin only)
CREATE POLICY "public_insert_orders" ON orders FOR INSERT WITH CHECK (true);

-- Customers: anyone can insert or update (loyalty points sync)
CREATE POLICY "public_insert_customers" ON customers FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update_customers" ON customers FOR UPDATE USING (true);
CREATE POLICY "public_select_customers" ON customers FOR SELECT USING (true);

-- ============================================================
-- Storage bucket for payment screenshots
-- Create manually in: Supabase Dashboard → Storage → New bucket
--   Name: screenshots
--   Public: true
-- Then add this policy:
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('screenshots', 'screenshots', true);
-- CREATE POLICY "public_upload_screenshots" ON storage.objects
--   FOR INSERT WITH CHECK (bucket_id = 'screenshots');
