import { useEffect, useState } from 'react';
import { MessageCircle, Phone, ArrowUp } from 'lucide-react';


export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="w-12 h-12 rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/30 flex items-center justify-center hover:bg-primary-700 hover:scale-110 transition-all animate-scale-in"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
      <a
        href="tel:+254700000000"
        className="w-12 h-12 rounded-full bg-secondary-500 text-white shadow-lg shadow-secondary-500/30 flex items-center justify-center hover:bg-secondary-600 hover:scale-110 transition-all"
        aria-label="Call now"
      >
        <Phone className="w-5 h-5" />
      </a>
      <a
        href="https://wa.me/254700000000"
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 rounded-full bg-success-500 text-white shadow-lg shadow-success-500/40 flex items-center justify-center hover:bg-success-600 hover:scale-110 transition-all"
        aria-label="WhatsApp chat"
      >
        <MessageCircle className="w-6 h-6" />
      </a>
    </div>
  );
}
