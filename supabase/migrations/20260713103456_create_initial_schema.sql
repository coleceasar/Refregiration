/*
# Wapendwa Refrigeration & AC Services — Initial Schema

## Overview
Creates the full data model for a refrigeration & air conditioning business website that handles
product sales, repair/maintenance services, customer bookings, testimonials, gallery, newsletter
subscriptions, and an admin dashboard. The app has an admin login (Supabase auth) but public-facing
content is readable by everyone (anon + authenticated).

## New Tables
1. `categories` — product categories (Refrigerators, Fridges, Freezers, Air Conditioners, AC Fans, Spare Parts)
2. `products` — products for sale, linked to a category
3. `services` — repair/maintenance services with estimated prices
4. `bookings` — customer repair service requests with reference numbers
5. `inquiries` — general contact form submissions
6. `testimonials` — customer reviews with ratings
7. `gallery` — gallery images of completed work
8. `newsletter` — email subscriptions
9. `banners` — homepage banner content
10. `faq` — frequently asked questions

## Security
- RLS enabled on every table.
- Public tables (categories, products, services, testimonials, gallery, banners, faq) are readable
  by anon + authenticated. Writes restricted to authenticated (admin).
- Private tables (bookings, inquiries, newsletter) are insertable by anon (public submission) but
  only readable/deletable by authenticated (admin).
- Products, services, testimonials, gallery, banners, faq, categories are fully managed (CRUD) by
  authenticated users only.
*/

-- ============ CATEGORIES ============
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_categories" ON categories;
CREATE POLICY "anon_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ============ PRODUCTS ============
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  price numeric(12,2) NOT NULL DEFAULT 0,
  availability text NOT NULL DEFAULT 'In Stock',
  brand text,
  images jsonb NOT NULL DEFAULT '[]'::jsonb,
  features jsonb NOT NULL DEFAULT '[]'::jsonb,
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  warranty text,
  is_featured boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

DROP POLICY IF EXISTS "anon_read_products" ON products;
CREATE POLICY "anon_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ============ SERVICES ============
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  estimated_price numeric(12,2) NOT NULL DEFAULT 0,
  image text,
  icon text,
  is_emergency boolean NOT NULL DEFAULT false,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

DROP POLICY IF EXISTS "anon_read_services" ON services;
CREATE POLICY "anon_read_services" ON services FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (true);

-- ============ BOOKINGS ============
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL UNIQUE,
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text,
  location text NOT NULL,
  appliance_type text NOT NULL,
  brand text,
  problem_description text NOT NULL,
  preferred_visit_date date,
  status text NOT NULL DEFAULT 'Pending',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(reference_number);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_bookings" ON bookings;
CREATE POLICY "auth_read_bookings" ON bookings FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_bookings" ON bookings;
CREATE POLICY "auth_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_bookings" ON bookings;
CREATE POLICY "auth_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (true);

-- ============ INQUIRIES ============
CREATE TABLE IF NOT EXISTS inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  subject text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'New',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_inquiries" ON inquiries;
CREATE POLICY "auth_read_inquiries" ON inquiries FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_update_inquiries" ON inquiries;
CREATE POLICY "auth_update_inquiries" ON inquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_inquiries" ON inquiries;
CREATE POLICY "auth_delete_inquiries" ON inquiries FOR DELETE
  TO authenticated USING (true);

-- ============ TESTIMONIALS ============
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  rating int NOT NULL DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
  message text NOT NULL,
  location text,
  is_approved boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_testimonials" ON testimonials;
CREATE POLICY "anon_read_testimonials" ON testimonials FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (true);

-- ============ GALLERY ============
CREATE TABLE IF NOT EXISTS gallery (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image text NOT NULL,
  category text NOT NULL DEFAULT 'General',
  description text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_gallery" ON gallery;
CREATE POLICY "anon_read_gallery" ON gallery FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (true);

-- ============ NEWSLETTER ============
CREATE TABLE IF NOT EXISTS newsletter (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter;
CREATE POLICY "anon_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_read_newsletter" ON newsletter;
CREATE POLICY "auth_read_newsletter" ON newsletter FOR SELECT
  TO authenticated USING (true);
DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter;
CREATE POLICY "auth_delete_newsletter" ON newsletter FOR DELETE
  TO authenticated USING (true);

-- ============ BANNERS ============
CREATE TABLE IF NOT EXISTS banners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  subtitle text,
  image text,
  cta_text text,
  cta_link text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_banners" ON banners;
CREATE POLICY "anon_read_banners" ON banners FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_banners" ON banners;
CREATE POLICY "auth_insert_banners" ON banners FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_banners" ON banners;
CREATE POLICY "auth_update_banners" ON banners FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_banners" ON banners;
CREATE POLICY "auth_delete_banners" ON banners FOR DELETE
  TO authenticated USING (true);

-- ============ FAQ ============
CREATE TABLE IF NOT EXISTS faq (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE faq ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_faq" ON faq;
CREATE POLICY "anon_read_faq" ON faq FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "auth_insert_faq" ON faq;
CREATE POLICY "auth_insert_faq" ON faq FOR INSERT
  TO authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "auth_update_faq" ON faq;
CREATE POLICY "auth_update_faq" ON faq FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "auth_delete_faq" ON faq;
CREATE POLICY "auth_delete_faq" ON faq FOR DELETE
  TO authenticated USING (true);