import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { Product } from '../lib/supabase';

import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  Phone,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Package,
} from 'lucide-react';

export default function ProductDetailPage({ slug }: { slug: string }) {
  const { navigate } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (data) {
        setProduct(data);
        setActiveImage(0);
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="h-96 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product Not Found</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/products')} className="btn-primary">
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>
      </div>
    );
  }

  const images = product.images.length > 0 ? product.images : ['https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=800'];

  const nextImage = () => setActiveImage((i) => (i + 1) % images.length);
  const prevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="animate-fade-in">
      {/* Breadcrumb */}
      <div className="bg-gray-50 dark:bg-gray-900 py-4">
        <div className="container-custom flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <button onClick={() => navigate('/')} className="hover:text-primary-600">Home</button>
          <span>/</span>
          <button onClick={() => navigate('/products')} className="hover:text-primary-600">Products</button>
          <span>/</span>
          <span className="text-gray-800 dark:text-gray-200 truncate">{product.name}</span>
        </div>
      </div>

      <div className="container-custom py-12">
        <button
          onClick={() => navigate('/products')}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Products
        </button>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="relative group rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 mb-4">
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-[400px] md:h-[500px] object-cover cursor-zoom-in"
                onClick={() => setZoomOpen(true)}
              />
              <button
                onClick={() => setZoomOpen(true)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              </button>
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-900/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      activeImage === i
                        ? 'border-primary-600'
                        : 'border-transparent hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <span className="text-sm text-primary-600 dark:text-primary-400 font-medium mb-2 block">
              {product.category?.name || 'Uncategorized'}
            </span>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">{product.name}</h1>
            {product.brand && (
              <p className="text-gray-500 dark:text-gray-400 mb-4">Brand: <span className="font-medium text-gray-700 dark:text-gray-300">{product.brand}</span></p>
            )}
            <div className="flex items-center gap-4 mb-6">
              <span className={`badge ${product.availability === 'In Stock' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'}`}>
                {product.availability}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>

            {/* Features */}
            {product.features.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Key Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {product.features.map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-success-500 shrink-0" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty */}
            {product.warranty && (
              <div className="flex items-center gap-3 p-4 rounded-xl bg-primary-50 dark:bg-primary-950/30 mb-6">
                <Shield className="w-6 h-6 text-primary-600 dark:text-primary-400 shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-gray-900 dark:text-white">Warranty</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{product.warranty}</div>
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <a href="tel:+254700000000" className="btn-primary flex-1">
                <Phone className="w-5 h-5" />
                Contact Seller
              </a>
              <button onClick={() => navigate('/booking')} className="btn-outline flex-1">
                Request Quote
              </button>
            </div>

            {/* Specifications */}
            {Object.keys(product.specifications).length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Specifications</h3>
                <div className="card overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                          <td className="px-4 py-3 font-medium text-gray-700 dark:text-gray-300 w-1/3">{key}</td>
                          <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {zoomOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomOpen(false)}
        >
          <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
            <X className="w-6 h-6 text-white" />
          </button>
          <img
            src={images[activeImage]}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
