import { useState } from 'react';
import { supabase } from '../lib/supabase';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error: insertError } = await supabase.from('inquiries').insert(form);
    if (insertError) {
      setError('Failed to send message. Please try again or call us.');
    } else {
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    }
    setSubmitting(false);
  };

  const contactInfo = [
    { icon: Phone, label: 'Phone', value: '+254 700 000 000', href: 'tel:+254700000000' },
    { icon: Mail, label: 'Email', value: 'info@wapendwa.co.ke', href: 'mailto:info@wapendwa.co.ke' },
    { icon: MapPin, label: 'Location', value: '123 Industrial Area, Nairobi, Kenya', href: null },
    { icon: Clock, label: 'Business Hours', value: 'Mon - Sat: 8:00 AM - 6:00 PM', href: null },
  ];

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Contact Us</h1>
          <p className="text-primary-100 text-lg">We're here to help with all your cooling needs</p>
        </div>
      </div>

      <section className="section">
        <div className="container-custom">
          {/* Contact info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {contactInfo.map((info, i) => (
              <div key={i} className="card-hover p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-primary-50 dark:bg-primary-950/50 flex items-center justify-center mx-auto mb-4">
                  <info.icon className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{info.label}</h3>
                {info.href ? (
                  <a href={info.href} className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    {info.value}
                  </a>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">{info.value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact form */}
            <div className="card p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
              {sent ? (
                <div className="text-center py-8 animate-scale-in">
                  <div className="w-16 h-16 rounded-full bg-success-50 dark:bg-success-950/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-success-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">We'll get back to you as soon as possible.</p>
                  <button onClick={() => setSent(false)} className="btn-outline">Send Another Message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="p-4 rounded-lg bg-error-50 dark:bg-error-950/30 text-error-700 dark:text-error-400 text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required className="input" placeholder="John Doe" />
                    </div>
                    <div>
                      <label className="label">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="label">Phone</label>
                      <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+254 700 000 000" />
                    </div>
                    <div>
                      <label className="label">Subject</label>
                      <input name="subject" value={form.subject} onChange={handleChange} className="input" placeholder="How can we help?" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="input resize-none" placeholder="Your message..." />
                  </div>
                  <button type="submit" disabled={submitting} className="btn-primary w-full py-4 disabled:opacity-60">
                    {submitting ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-5 h-5" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Map & social */}
            <div className="space-y-6">
              {/* WhatsApp CTA */}
              <div className="card p-6 bg-gradient-to-br from-success-500 to-success-600 border-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-white text-lg">Chat on WhatsApp</h3>
                    <p className="text-success-100 text-sm">Quick responses during business hours</p>
                  </div>
                  <a
                    href="https://wa.me/254700000000"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn bg-white text-success-600 hover:bg-gray-100 text-sm py-2.5"
                  >
                    Chat Now
                  </a>
                </div>
              </div>

              {/* Map */}
              <div className="card overflow-hidden">
                <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    Find Us
                  </h3>
                </div>
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=36.82%2C-1.30%2C36.86%2C-1.26&layer=mapnik"
                  className="w-full h-64 border-0"
                  loading="lazy"
                  title="Location map"
                />
              </div>

              {/* Social */}
              <div className="card p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="w-11 h-11 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-primary-600 flex items-center justify-center transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-700 dark:text-gray-300 hover:text-white transition-colors" />
                    </a>
                  ))}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                  Stay connected for the latest updates, tips, and special offers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
