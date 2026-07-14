import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { Product, Service, Testimonial, GalleryItem, Banner, FAQ, Category } from '../lib/supabase';
import { StarRating, SectionHeader, formatPrice } from '../components/ui';
import {
  Snowflake,
  Wrench,
  ShieldCheck,
  Tag,
  Clock,
  Home,
  Building2,
  Award,
  Heart,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Phone,
  Star,
  Zap,
  Droplet,
  Fan,
  Thermometer,
  Settings,
  Siren,
  Wind,
} from 'lucide-react';

const iconMap: Record<string, any> = {
  Refrigerator: Snowflake,
  Wind: Wind,
  Fan: Fan,
  Wrench: Wrench,
  Droplet: Droplet,
  Zap: Zap,
  Thermometer: Thermometer,
  Settings: Settings,
  Siren: Siren,
};

export default function HomePage() {
  const { navigate } = useApp();
  const [banner, setBanner] = useState<Banner | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      const [b, p, s, t, g, f, c] = await Promise.all([
        supabase.from('banners').select('*').eq('is_active', true).order('sort_order').limit(1).maybeSingle(),
        supabase.from('products').select('*, category:categories(*)').eq('is_featured', true).order('sort_order').limit(8),
        supabase.from('services').select('*').order('sort_order').limit(12),
        supabase.from('testimonials').select('*').eq('is_approved', true).order('created_at', { ascending: false }).limit(6),
        supabase.from('gallery').select('*').order('sort_order').limit(8),
        supabase.from('faq').select('*').order('sort_order'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      if (b.data) setBanner(b.data);
      if (p.data) setFeaturedProducts(p.data);
      if (s.data) setServices(s.data);
      if (t.data) setTestimonials(t.data);
      if (g.data) setGallery(g.data);
      if (f.data) setFaqs(f.data);
      if (c.data) setCategories(c.data);
    })();
  }, []);

  const whyChooseUs = [
    { icon: Award, title: 'Certified Technicians', desc: 'Our team is fully trained and certified.' },
    { icon: ShieldCheck, title: 'Genuine Spare Parts', desc: 'Only authentic parts for lasting repairs.' },
    { icon: Tag, title: 'Affordable Prices', desc: 'Competitive pricing with no hidden costs.' },
    { icon: Clock, title: 'Fast Response', desc: 'Quick turnaround on all service calls.' },
    { icon: Home, title: 'Home Service Available', desc: 'We come to you anywhere in the city.' },
    { icon: Building2, title: 'Commercial Services', desc: 'Full support for business cooling needs.' },
    { icon: Heart, title: 'Warranty on Repairs', desc: 'All repairs backed by our service warranty.' },
    { icon: Star, title: 'Customer Satisfaction', desc: 'Your comfort is our top priority.' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative min-h-[600px] md:min-h-[680px] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={banner?.image || 'https://images.pexels.com/photos/4109637/pexels-photo-4109637.jpeg?auto=compress&cs=tinysrgb&w=1920'}
            alt="Refrigeration and cooling"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-950/70 to-gray-950/40" />
        </div>
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/20 backdrop-blur-sm border border-primary-400/30 text-primary-200 text-sm font-medium mb-6 animate-fade-in-up">
              <Snowflake className="w-4 h-4" />
              Trusted by 500+ happy customers
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 animate-fade-in-up">
              Your Trusted Refrigeration & <span className="text-primary-400">Cooling Solutions</span> Partner
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl animate-fade-in-up">
              We Sell, Install, Repair, and Maintain Refrigerators, Freezers, Fridges, Air
              Conditioners, and AC Fans.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up">
              <button onClick={() => navigate('/products')} className="btn-primary text-base px-8 py-4">
                Shop Products
                <ArrowRight className="w-5 h-5" />
              </button>
              <button onClick={() => navigate('/booking')} className="btn-outline text-base px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900 dark:hover:text-gray-900">
                Book a Repair
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {categories.map((cat) => {
              const Icon = iconMap[cat.icon || ''] || Snowflake;
              return (
                <button
                  key={cat.id}
                  onClick={() => navigate(`/products?category=${cat.slug}`)}
                  className="card-hover p-4 flex flex-col items-center text-center gap-2 group"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                    <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                  </div>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/4109637/pexels-photo-4109637.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="About Wapendwa"
                  className="w-full h-[400px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-primary-600 text-white p-6 rounded-2xl shadow-xl hidden md:block">
                <div className="text-3xl font-bold">10+</div>
                <div className="text-sm text-primary-100">Years Experience</div>
              </div>
            </div>
            <div>
              <SectionHeader title="About Wapendwa" center={false} />
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Wapendwa Refrigeration & Air Conditioning Services is your one-stop destination for
                all cooling solutions. We specialize in selling genuine cooling appliances,
                professional installation, routine maintenance, and expert repair of residential
                and commercial refrigeration equipment.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Genuine cooling appliances',
                  'Professional installation services',
                  'Routine maintenance contracts',
                  'Expert repair services',
                  'Affordable & transparent pricing',
                  'Experienced certified technicians',
                  'Fast and reliable service',
                  'Residential & commercial',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => navigate('/about')} className="btn-primary">
                Learn More About Us
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeader
            title="Why Choose Us"
            subtitle="We deliver excellence in every service we provide"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div
                key={i}
                className="card-hover p-6 text-center group"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-primary-500/20">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Featured Products</h2>
              <p className="text-gray-600 dark:text-gray-400 text-lg">Top-quality cooling appliances from trusted brands</p>
              <div className="h-1.5 w-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mt-4" />
            </div>
            <button onClick={() => navigate('/products')} className="btn-outline mt-4 md:mt-0">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="card-hover overflow-hidden group flex flex-col">
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/4109637/pexels-photo-4109637.jpeg?auto=compress&cs=tinysrgb&w=800'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.is_featured && (
                    <span className="absolute top-3 left-3 badge bg-primary-600 text-white">Featured</span>
                  )}
                  <span className={`absolute top-3 right-3 badge ${product.availability === 'In Stock' ? 'bg-success-500 text-white' : 'bg-warning-500 text-white'}`}>
                    {product.availability}
                  </span>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <span className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{formatPrice(product.price)}</span>
                    <button
                      onClick={() => navigate(`/products/${product.slug}`)}
                      className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeader
            title="Repair & Maintenance Services"
            subtitle="Comprehensive cooling services delivered by certified professionals"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = iconMap[service.icon || ''] || Wrench;
              return (
                <div key={service.id} className="card-hover p-6 group flex flex-col">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center shrink-0 group-hover:bg-primary-500 transition-colors">
                      <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{service.name}</h3>
                        {service.is_emergency && (
                          <span className="badge bg-error-500 text-white">24/7</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 flex-1">{service.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      From <span className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(service.estimated_price)}</span>
                    </span>
                    <button onClick={() => navigate('/booking')} className="btn-secondary text-sm py-2 px-4">
                      Book Service
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section">
        <div className="container-custom">
          <SectionHeader title="Our Gallery" subtitle="See our work in action" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {gallery.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate('/gallery')}
                className="relative group cursor-pointer overflow-hidden rounded-xl aspect-square"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div>
                    <span className="text-xs text-primary-300 font-medium">{item.category}</span>
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section bg-gray-50 dark:bg-gray-900">
        <div className="container-custom">
          <SectionHeader title="What Our Customers Say" subtitle="Real reviews from satisfied clients" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.id} className="card p-6 flex flex-col">
                <StarRating rating={t.rating} size="md" />
                <p className="text-gray-700 dark:text-gray-300 my-4 flex-1 italic">"{t.message}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center text-white font-bold text-sm">
                    {t.customer_name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">{t.customer_name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{t.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section">
        <div className="container-custom max-w-3xl">
          <SectionHeader title="Frequently Asked Questions" subtitle="Find answers to common questions" />
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={faq.id} className="card overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-secondary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Need Cooling Solutions Today?</h2>
          <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
            Whether you need a new appliance, a quick repair, or routine maintenance, our team is
            ready to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/booking')} className="btn bg-white text-primary-700 hover:bg-gray-100 text-base px-8 py-4">
              Book a Service
              <ArrowRight className="w-5 h-5" />
            </button>
            <a href="tel:+254700000000" className="btn border-2 border-white text-white hover:bg-white hover:text-primary-700 text-base px-8 py-4">
              <Phone className="w-5 h-5" />
              Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
