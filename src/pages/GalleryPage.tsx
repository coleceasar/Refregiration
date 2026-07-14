import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { GalleryItem } from '../lib/supabase';
import { X, ZoomIn } from 'lucide-react';

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [lightbox, setLightbox] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('gallery').select('*').order('sort_order');
      if (data) setItems(data);
      setLoading(false);
    })();
  }, []);

  const categories = ['all', ...Array.from(new Set(items.map((i) => i.category)))];
  const filtered = filter === 'all' ? items : items.filter((i) => i.category === filter);

  return (
    <div className="animate-fade-in">
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Gallery</h1>
          <p className="text-primary-100 text-lg">A showcase of our work and completed projects</p>
        </div>
      </div>

      <section className="section">
        <div className="container-custom">
          {/* Filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  filter === cat
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat === 'all' ? 'All' : cat}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-800 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  onClick={() => setLightbox(i)}
                  className="relative group cursor-pointer overflow-hidden rounded-xl aspect-[4/3]"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-5">
                    <div>
                      <span className="text-xs text-primary-300 font-medium">{item.category}</span>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      {item.description && (
                        <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={filtered[lightbox].image}
              alt={filtered[lightbox].title}
              className="w-full max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-4">
              <span className="text-sm text-primary-400 font-medium">{filtered[lightbox].category}</span>
              <h3 className="text-white font-semibold text-lg">{filtered[lightbox].title}</h3>
              {filtered[lightbox].description && (
                <p className="text-gray-400 text-sm mt-1">{filtered[lightbox].description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
