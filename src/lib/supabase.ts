import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  availability: string;
  brand: string | null;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  warranty: string | null;
  is_featured: boolean;
  sort_order: number;
  category?: Category;
};

export type Service = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  estimated_price: number;
  image: string | null;
  icon: string | null;
  is_emergency: boolean;
  sort_order: number;
};

export type Booking = {
  id: string;
  reference_number: string;
  full_name: string;
  phone_number: string;
  email: string | null;
  location: string;
  appliance_type: string;
  brand: string | null;
  problem_description: string;
  preferred_visit_date: string | null;
  status: string;
  created_at: string;
};

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
};

export type Testimonial = {
  id: string;
  customer_name: string;
  rating: number;
  message: string;
  location: string | null;
  is_approved: boolean;
  created_at: string;
};

export type GalleryItem = {
  id: string;
  title: string;
  image: string;
  category: string;
  description: string | null;
  sort_order: number;
};

export type Banner = {
  id: string;
  title: string;
  subtitle: string | null;
  image: string | null;
  cta_text: string | null;
  cta_link: string | null;
  is_active: boolean;
  sort_order: number;
};

export type FAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type NewsletterSub = {
  id: string;
  email: string;
  created_at: string;
};

export async function checkIsAdmin(): Promise<boolean> {
  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) return false;
  const { data, error } = await supabase.rpc('is_admin');
  if (error || data === null) return false;
  return data === true;
}
