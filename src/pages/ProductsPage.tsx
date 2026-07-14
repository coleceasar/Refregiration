import { useEffect, useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { supabase } from '../lib/supabase';
import type { Product, Category } from '../lib/supabase';
import { formatPrice } from '../components/ui';
import { Search, SlidersHorizontal, X, Package } from 'lucide-react';

export default function ProductsPage() {
  const { navigate, route } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('default');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      const [p, c] = await Promise.all([
        supabase.from('products').select('*, category:categories(*)').order('sort_order'),
        supabase.from('categories').select('*').order('sort_order'),
      ]);
      if (p.data) setProducts(p.data);
      if (c.data) setCategories(c.data);
      setLoading(false);
    })();
  }, []);

  // Parse query params from route
  useEffect(() => {
    const queryStr = route.split('?')[1];
    if (queryStr) {
      const params = new URLSearchParams(queryStr);
      const cat = params.get('category');
      const search = params.get('search');
      if (cat) setSelectedCategory(cat);
      if (search) setSearchQuery(search);
    }
  }, [route]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q)
      );
    }
    if (sortBy === 'price-low') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'name') result.sort((a, b) => a.name.localeCompare(b.name));
    return result;
  }, [products, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="bg-gradient-to-r from-primary-700 to-secondary-700 py-16">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">Our Products</h1>
          <p className="text-primary-100 text-lg">Browse our wide range of cooling appliances and spare parts</p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search & filter bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input pl-12"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input md:w-48"
          >
            <option value="default">Sort by: Default</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn-outline md:hidden"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Category tabs */}
        <div className={`${showFilters ? 'block' : 'hidden'} md:block mb-8`}>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All Products
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Showing <span className="font-semibold text-gray-800 dark:text-gray-200">{filteredProducts.length}</span> products
          </p>
          {(selectedCategory !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear filters
            </button>
          )}
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card p-4 animate-pulse">
                <div className="h-52 bg-gray-200 dark:bg-gray-800 rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No products found</h3>
            <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="card-hover overflow-hidden group flex flex-col">
                <div className="relative h-52 overflow-hidden bg-gray-100 dark:bg-gray-800 cursor-pointer" onClick={() => navigate(`/products/${product.slug}`)}>
                  <img
                    src={product.images[0] || 'https://images.pexels.com/photos/3926542/pexels-photo-3926542.jpeg?auto=compress&cs=tinysrgb&w=800'}
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
                  <div className="mt-auto">
                    <div className="text-lg font-bold text-primary-600 dark:text-primary-400 mb-3">{formatPrice(product.price)}</div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className="btn-primary text-sm py-2 px-4 flex-1"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => navigate('/contact')}
                        className="btn-outline text-sm py-2 px-4"
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
