/*
# Tighten RLS Policies — Restrict Admin Writes & Validate Public Inserts

## Problem
All authenticated-user write policies (INSERT/UPDATE/DELETE) used `USING (true)` / `WITH CHECK (true)`,
meaning ANY logged-in user could modify any data. Public INSERT policies on bookings, inquiries,
and newsletter also had `WITH CHECK (true)` with no validation.

## Solution
1. Create an `admins` table listing which authenticated users are admins.
2. Create a helper SQL function `is_admin()` that checks whether `auth.uid()` exists in `admins`.
3. Replace every authenticated write policy's `true` predicate with `is_admin()` so only admin
   users can create/update/delete business data (products, services, categories, banners, faq,
   gallery, testimonials, bookings, inquiries, newsletter).
4. Add WITH CHECK validation on public INSERT policies (bookings, inquiries, newsletter) so
   anon users can only insert rows with required fields populated.

## New Tables
- `admins` (id, user_id, email, created_at) — whitelist of admin users

## New Functions
- `is_admin()` returns boolean — true if the current authenticated user is in the admins table

## Security Changes
- All authenticated INSERT/UPDATE/DELETE policies now require `is_admin()`.
- Public INSERT policies on bookings/inquiries/newsletter now validate required fields.
*/

-- ============ ADMINS TABLE ============
CREATE TABLE IF NOT EXISTS admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Only admins can read the admin list; no one can insert/update via anon key
-- (admin provisioning is done via service-role / SQL, not the frontend)
DROP POLICY IF EXISTS "admin_read_admins" ON admins;
CREATE POLICY "admin_read_admins" ON admins FOR SELECT
  TO authenticated USING (EXISTS (SELECT 1 FROM admins a WHERE a.user_id = auth.uid()));

-- ============ IS_ADMIN FUNCTION ============
-- SECURITY DEFINER so it can read the admins table even when the calling role
-- doesn't have SELECT access (RLS on admins only allows self-referencing reads).
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE user_id = auth.uid());
$$;

-- ============ CATEGORIES ============
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (is_admin());

-- ============ PRODUCTS ============
DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (is_admin());

-- ============ SERVICES ============
DROP POLICY IF EXISTS "auth_insert_services" ON services;
CREATE POLICY "auth_insert_services" ON services FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_services" ON services;
CREATE POLICY "auth_update_services" ON services FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_services" ON services;
CREATE POLICY "auth_delete_services" ON services FOR DELETE
  TO authenticated USING (is_admin());

-- ============ BOOKINGS ============
-- Public can submit bookings but required fields must be present
DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    full_name IS NOT NULL AND length(trim(full_name)) > 0
    AND phone_number IS NOT NULL AND length(trim(phone_number)) > 0
    AND location IS NOT NULL AND length(trim(location)) > 0
    AND appliance_type IS NOT NULL AND length(trim(appliance_type)) > 0
    AND problem_description IS NOT NULL AND length(trim(problem_description)) > 0
  );
DROP POLICY IF EXISTS "auth_update_bookings" ON bookings;
CREATE POLICY "auth_update_bookings" ON bookings FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_bookings" ON bookings;
CREATE POLICY "auth_delete_bookings" ON bookings FOR DELETE
  TO authenticated USING (is_admin());

-- ============ INQUIRIES ============
-- Public can submit inquiries but required fields must be present
DROP POLICY IF EXISTS "anon_insert_inquiries" ON inquiries;
CREATE POLICY "anon_insert_inquiries" ON inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    name IS NOT NULL AND length(trim(name)) > 0
    AND email IS NOT NULL AND length(trim(email)) > 0
    AND message IS NOT NULL AND length(trim(message)) > 0
  );
DROP POLICY IF EXISTS "auth_update_inquiries" ON inquiries;
CREATE POLICY "auth_update_inquiries" ON inquiries FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_inquiries" ON inquiries;
CREATE POLICY "auth_delete_inquiries" ON inquiries FOR DELETE
  TO authenticated USING (is_admin());

-- ============ TESTIMONIALS ============
DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
CREATE POLICY "auth_insert_testimonials" ON testimonials FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
CREATE POLICY "auth_update_testimonials" ON testimonials FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;
CREATE POLICY "auth_delete_testimonials" ON testimonials FOR DELETE
  TO authenticated USING (is_admin());

-- ============ GALLERY ============
DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
CREATE POLICY "auth_insert_gallery" ON gallery FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
CREATE POLICY "auth_update_gallery" ON gallery FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;
CREATE POLICY "auth_delete_gallery" ON gallery FOR DELETE
  TO authenticated USING (is_admin());

-- ============ NEWSLETTER ============
-- Public can subscribe with a valid email
DROP POLICY IF EXISTS "anon_insert_newsletter" ON newsletter;
CREATE POLICY "anon_insert_newsletter" ON newsletter FOR INSERT
  TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND length(trim(email)) > 0 AND email ~* '^[^@]+@[^@]+\.[^@]+$');
DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter;
CREATE POLICY "auth_delete_newsletter" ON newsletter FOR DELETE
  TO authenticated USING (is_admin());

-- ============ BANNERS ============
DROP POLICY IF EXISTS "auth_insert_banners" ON banners;
CREATE POLICY "auth_insert_banners" ON banners FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_banners" ON banners;
CREATE POLICY "auth_update_banners" ON banners FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_banners" ON banners;
CREATE POLICY "auth_delete_banners" ON banners FOR DELETE
  TO authenticated USING (is_admin());

-- ============ FAQ ============
DROP POLICY IF EXISTS "auth_insert_faq" ON faq;
CREATE POLICY "auth_insert_faq" ON faq FOR INSERT
  TO authenticated WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_update_faq" ON faq;
CREATE POLICY "auth_update_faq" ON faq FOR UPDATE
  TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "auth_delete_faq" ON faq;
CREATE POLICY "auth_delete_faq" ON faq FOR DELETE
  TO authenticated USING (is_admin());
