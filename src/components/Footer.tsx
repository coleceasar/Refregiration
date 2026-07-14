import { useApp } from '../context/AppContext';
import {
  Snowflake,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Send,
  Clock,
} from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const { navigate } = useApp();
  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const { error } = await supabase.from('newsletter').upsert({ email }, { onConflict: 'email' });
    if (error) {
      setSubStatus('error');
    } else {
      setSubStatus('success');
      setEmail('');
    }
    setTimeout(() => setSubStatus('idle'), 3000);
  };

  const quickLinks = [
    { label: 'Home', route: '/' },
    { label: 'About Us', route: '/about' },
    { label: 'Products', route: '/products' },
    { label: 'Services', route: '/services' },
    { label: 'Gallery', route: '/gallery' },
    { label: 'FAQ', route: '/faq' },
    { label: 'Contact', route: '/contact' },
    { label: 'Book a Repair', route: '/booking' },
  ];

  const productLinks = [
    'Refrigerators',
    'Fridges',
    'Freezers',
    'Air Conditioners',
    'AC Fans',
    'Spare Parts',
  ];

  const serviceLinks = [
    'Refrigerator Repair',
    'AC Repair',
    'Gas Refilling',
    'Compressor Replacement',
    'Installation',
    'Emergency Repair',
  ];

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* Newsletter */}
      <div className="border-b border-gray-800">
        <div className="container-custom py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-white text-xl font-bold mb-1">Subscribe to Our Newsletter</h3>
              <p className="text-sm">Get the latest updates on products, services, and special offers.</p>
            </div>
            <form onSubmit={subscribe} className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input md:w-72 bg-gray-900 border-gray-700"
                required
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                <Send className="w-4 h-4" />
                Subscribe
              </button>
            </form>
          </div>
          {subStatus === 'success' && (
            <p className="text-success-400 text-sm mt-3 animate-fade-in">Thank you for subscribing!</p>
          )}
          {subStatus === 'error' && (
            <p className="text-error-400 text-sm mt-3 animate-fade-in">Something went wrong. Please try again.</p>
          )}
        </div>
      </div>

      {/* Main footer */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center">
                <Snowflake className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-display font-bold text-white text-sm">Wapendwa</div>
                <div className="text-xs text-gray-500">Refrigeration & AC</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-4">
              Your trusted partner for refrigeration and air conditioning sales, installation,
              repair, and maintenance services.
            </p>
            <div className="flex gap-3">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                  aria-label="Social media"
                >
                  <Icon className="w-4 h-4 text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.route}>
                  <button
                    onClick={() => navigate(link.route)}
                    className="hover:text-primary-400 transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Products & Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Products & Services</h4>
            <ul className="space-y-2 text-sm mb-4">
              {productLinks.map((p) => (
                <li key={p}>
                  <button
                    onClick={() => navigate('/products')}
                    className="hover:text-primary-400 transition-colors text-left"
                  >
                    {p}
                  </button>
                </li>
              ))}
            </ul>
            <ul className="space-y-2 text-sm">
              {serviceLinks.map((s) => (
                <li key={s}>
                  <button
                    onClick={() => navigate('/services')}
                    className="hover:text-primary-400 transition-colors text-left"
                  >
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Info</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>123 Industrial Area, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="tel:+254700000000" className="hover:text-primary-400 transition-colors">
                  +254 700 000 000
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                <a href="mailto:info@wapendwa.co.ke" className="hover:text-primary-400 transition-colors">
                  info@wapendwa.co.ke
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-primary-400 mt-0.5 shrink-0" />
                <span>Mon - Sat: 8:00 AM - 6:00 PM<br />Sun: Emergency only</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <p>&copy; {new Date().getFullYear()} Wapendwa Refrigeration & Air Conditioning Services. All rights reserved.</p>
            <div className="flex gap-6">
              <button className="hover:text-primary-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-primary-400 transition-colors">Terms & Conditions</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
