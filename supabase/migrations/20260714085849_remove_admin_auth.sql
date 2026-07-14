/*
# Remove Admin/Auth Infrastructure — Make Site Fully Public

## Overview
Removes the admins table, is_admin() function, and all authenticated-only write policies.
The site becomes a public website with no login. All tables remain readable by anon+authenticated.
Public INSERT policies on bookings, inquiries, and newsletter remain (with validation).

## Security Changes
- Drop all authenticated write policies (they reference is_admin()).
- Drop `is_admin()` function (was SECURITY DEFINER, executable by anon — security risk).
- Drop `admins` table.
- Keep: anon SELECT on all public tables, anon INSERT on bookings/inquiries/newsletter with validation.
*/

-- 1. Drop all authenticated write policies first (they depend on is_admin)
DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
DROP POLICY IF EXISTS "auth_update_categories" ON categories;
DROP POLICY IF EXISTS "auth_delete_categories" ON categories;

DROP POLICY IF EXISTS "auth_insert_products" ON products;
DROP POLICY IF EXISTS "auth_update_products" ON products;
DROP POLICY IF EXISTS "auth_delete_products" ON products;

DROP POLICY IF EXISTS "auth_insert_services" ON services;
DROP POLICY IF EXISTS "auth_update_services" ON services;
DROP POLICY IF EXISTS "auth_delete_services" ON services;

DROP POLICY IF EXISTS "auth_update_bookings" ON bookings;
DROP POLICY IF EXISTS "auth_delete_bookings" ON bookings;

DROP POLICY IF EXISTS "auth_update_inquiries" ON inquiries;
DROP POLICY IF EXISTS "auth_delete_inquiries" ON inquiries;

DROP POLICY IF EXISTS "auth_insert_testimonials" ON testimonials;
DROP POLICY IF EXISTS "auth_update_testimonials" ON testimonials;
DROP POLICY IF EXISTS "auth_delete_testimonials" ON testimonials;

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery;
DROP POLICY IF EXISTS "auth_update_gallery" ON gallery;
DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery;

DROP POLICY IF EXISTS "auth_delete_newsletter" ON newsletter;

DROP POLICY IF EXISTS "auth_insert_banners" ON banners;
DROP POLICY IF EXISTS "auth_update_banners" ON banners;
DROP POLICY IF EXISTS "auth_delete_banners" ON banners;

DROP POLICY IF EXISTS "auth_insert_faq" ON faq;
DROP POLICY IF EXISTS "auth_update_faq" ON faq;
DROP POLICY IF EXISTS "auth_delete_faq" ON faq;

-- 2. Now drop the function (no more dependents)
DROP FUNCTION IF EXISTS is_admin();

-- 3. Drop the admins table
DROP TABLE IF EXISTS admins;
