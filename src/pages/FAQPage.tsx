import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { FAQ } from '../lib/supabase';
import { ChevronDown, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function FAQPage() {
  const { navigate } = useApp();
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('faq').select('*').order('sort_order');
      if (data) setFaqs(data);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Frequently Asked Questions</h1>
          <p className="text-primary-100 text-lg">Find answers to common questions about our services</p>
        </div>
      </div>

      <section className="section">
        <div className="container-custom max-w-3xl">
          {loading ? (
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={faq.id} className="card overflow-hidden">
                  <button
                    onClick={() => setOpen(open === i ? null : i)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left"
                  >
                    <span className="font-semibold text-gray-900 dark:text-white">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform shrink-0 ${open === i ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {open === i && (
                    <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 text-sm leading-relaxed animate-fade-in">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Still have questions */}
          <div className="mt-12 text-center card p-8">
            <MessageCircle className="w-12 h-12 text-primary-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Still Have Questions?</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Our team is ready to help with any questions you may have</p>
            <button onClick={() => navigate('/contact')} className="btn-primary">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
