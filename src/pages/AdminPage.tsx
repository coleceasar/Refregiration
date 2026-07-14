import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { supabase, checkIsAdmin } from '../lib/supabase';
import type { Product, Service, Booking, Inquiry, Testimonial, GalleryItem, Category } from '../lib/supabase';
import { formatPrice } from '../components/ui';
import {
  LayoutDashboard,
  Package,
  Wrench,
  CalendarCheck,
  MessageSquare,
  Star,
  Image as ImageIcon,
  LogOut,
  Loader2,
  Plus,
  Pencil,
  Trash2,
  X,
  Users,
  DollarSign,
  Tag,
  Settings,
  ShieldAlert,
} from 'lucide-react';

type Tab = 'dashboard' | 'products' | 'services' | 'bookings' | 'inquiries' | 'testimonials' | 'gallery' | 'categories';

export default function AdminPage() {
  const { session, navigate } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminChecking, setAdminChecking] = useState(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setAuthError(error.message);
    }
    setAuthLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Load data when authenticated
  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      setAdminChecking(false);
      return;
    }
    setAdminChecking(true);
    (async () => {
      const admin = await checkIsAdmin();
      setIsAdmin(admin);
      setAdminChecking(false);
      if (admin) loadAll();
    })();
  }, [session]);

  const loadAll = async () => {
    const [p, s, b, i, t, g, c] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('bookings').select('*').order('created_at', { ascending: false }),
      supabase.from('inquiries').select('*').order('created_at', { ascending: false }),
      supabase.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabase.from('gallery').select('*').order('sort_order'),
      supabase.from('categories').select('*').order('sort_order'),
    ]);
    if (p.data) setProducts(p.data);
    if (s.data) setServices(s.data);
    if (b.data) setBookings(b.data);
    if (i.data) setInquiries(i.data);
    if (t.data) setTestimonials(t.data);
    if (g.data) setGallery(g.data);
    if (c.data) setCategories(c.data);
  };

  if (!session) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="card p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center mx-auto mb-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Login</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Sign in to manage your dashboard</p>
          </div>
          {authError && (
            <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-950/30 text-error-700 dark:text-error-400 text-sm">
              {authError}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
                placeholder="admin@wapendwa.co.ke"
              />
            </div>
            <div>
              <label className="label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input"
                placeholder="••••••••"
              />
            </div>
            <button type="submit" disabled={authLoading} className="btn-primary w-full py-3.5 disabled:opacity-60">
              {authLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (adminChecking) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
        <div className="card p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-2xl bg-error-50 dark:bg-error-950/30 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-error-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Access Denied</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Your account does not have admin privileges. Please contact the site administrator if you
            believe this is an error.
          </p>
          <button onClick={handleLogout} className="btn-outline">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'services', label: 'Services', icon: Wrench },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'inquiries', label: 'Inquiries', icon: MessageSquare },
    { id: 'testimonials', label: 'Testimonials', icon: Star },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'categories', label: 'Categories', icon: Tag },
  ];

  const totalRevenue = bookings.length * 2500 + products.reduce((sum, p) => sum + p.price, 0) * 0.1;
  const newInquiries = inquiries.filter((i) => i.status === 'New').length;

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadAll();
  };

  const deleteService = async (id: string) => {
    if (!confirm('Delete this service?')) return;
    await supabase.from('services').delete().eq('id', id);
    loadAll();
  };

  const deleteTestimonial = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return;
    await supabase.from('testimonials').delete().eq('id', id);
    loadAll();
  };

  const deleteGalleryItem = async (id: string) => {
    if (!confirm('Delete this gallery item?')) return;
    await supabase.from('gallery').delete().eq('id', id);
    loadAll();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    await supabase.from('categories').delete().eq('id', id);
    loadAll();
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from('bookings').update({ status }).eq('id', id);
    loadAll();
  };

  const updateInquiryStatus = async (id: string, status: string) => {
    await supabase.from('inquiries').update({ status }).eq('id', id);
    loadAll();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 animate-fade-in">
      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Manage your business operations</p>
          </div>
          <button onClick={handleLogout} className="btn-outline text-sm">
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto mb-8 pb-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Dashboard overview */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: DollarSign, label: 'Est. Revenue', value: formatPrice(Math.round(totalRevenue)), color: 'success' },
                { icon: CalendarCheck, label: 'Total Bookings', value: bookings.length, color: 'primary' },
                { icon: Package, label: 'Products', value: products.length, color: 'secondary' },
                { icon: Users, label: 'New Inquiries', value: newInquiries, color: 'warning' },
              ].map((stat, i) => (
                <div key={i} className="card p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-12 h-12 rounded-xl bg-${stat.color}-50 dark:bg-${stat.color}-950/30 flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Recent bookings */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Recent Bookings
              </h3>
              <div className="space-y-3">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{b.full_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{b.appliance_type} - {b.reference_number}</div>
                    </div>
                    <span className={`badge ${
                      b.status === 'Pending' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' :
                      b.status === 'Completed' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' :
                      'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                    }`}>{b.status}</span>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No bookings yet</p>}
              </div>
            </div>

            {/* Recent inquiries */}
            <div className="card p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                Recent Inquiries
              </h3>
              <div className="space-y-3">
                {inquiries.slice(0, 5).map((inq) => (
                  <div key={inq.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{inq.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{inq.subject || inq.message.slice(0, 50)}</div>
                    </div>
                    <span className={`badge ${inq.status === 'New' ? 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'}`}>{inq.status}</span>
                  </div>
                ))}
                {inquiries.length === 0 && <p className="text-sm text-gray-400 text-center py-4">No inquiries yet</p>}
              </div>
            </div>
          </div>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Products ({products.length})</h2>
              <button onClick={() => { setEditingProduct(null); setShowProductModal(true); }} className="btn-primary text-sm">
                <Plus className="w-4 h-4" />
                Add Product
              </button>
            </div>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Product</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Category</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Price</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-700 dark:text-gray-300">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-700 dark:text-gray-300">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100 dark:border-gray-800">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.images[0] || ''} alt="" className="w-10 h-10 rounded-lg object-cover" />
                            <span className="font-medium text-gray-900 dark:text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-400">{p.category?.name || '-'}</td>
                        <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{formatPrice(p.price)}</td>
                        <td className="px-4 py-3"><span className={`badge ${p.availability === 'In Stock' ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-900/30 dark:text-warning-400'}`}>{p.availability}</span></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <button onClick={() => { setEditingProduct(p); setShowProductModal(true); }} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                              <Pencil className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </button>
                            <button onClick={() => deleteProduct(p.id)} className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/30">
                              <Trash2 className="w-4 h-4 text-error-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {showProductModal && (
              <ProductModal
                product={editingProduct}
                categories={categories}
                onClose={() => setShowProductModal(false)}
                onSaved={() => { setShowProductModal(false); loadAll(); }}
              />
            )}
          </div>
        )}

        {/* Services tab */}
        {tab === 'services' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Services ({services.length})</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s) => (
                <div key={s.id} className="card p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{s.name}</h3>
                    <button onClick={() => deleteService(s.id)} className="p-1.5 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/30">
                      <Trash2 className="w-4 h-4 text-error-500" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">{s.description}</p>
                  <div className="font-bold text-primary-600 dark:text-primary-400">{formatPrice(s.estimated_price)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Bookings tab */}
        {tab === 'bookings' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Bookings ({bookings.length})</h2>
            <div className="space-y-4">
              {bookings.map((b) => (
                <div key={b.id} className="card p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{b.full_name}</span>
                        <span className="text-xs font-mono text-primary-600 dark:text-primary-400">{b.reference_number}</span>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <div>Phone: {b.phone_number}</div>
                        <div>Email: {b.email || 'N/A'}</div>
                        <div>Location: {b.location}</div>
                        <div>Appliance: {b.appliance_type} {b.brand && `(${b.brand})`}</div>
                        {b.preferred_visit_date && <div>Preferred: {b.preferred_visit_date}</div>}
                        <div>Booked: {new Date(b.created_at).toLocaleDateString()}</div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{b.problem_description}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <select
                        value={b.status}
                        onChange={(e) => updateBookingStatus(b.id, e.target.value)}
                        className="input text-sm py-2"
                      >
                        <option value="Pending">Pending</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {bookings.length === 0 && <p className="text-gray-400 text-center py-12">No bookings yet</p>}
            </div>
          </div>
        )}

        {/* Inquiries tab */}
        {tab === 'inquiries' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Inquiries ({inquiries.length})</h2>
            <div className="space-y-4">
              {inquiries.map((inq) => (
                <div key={inq.id} className="card p-5">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-semibold text-gray-900 dark:text-white">{inq.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{inq.email}</span>
                        {inq.phone && <span className="text-sm text-gray-500 dark:text-gray-400">{inq.phone}</span>}
                      </div>
                      {inq.subject && <div className="font-medium text-gray-800 dark:text-gray-200 text-sm mb-1">{inq.subject}</div>}
                      <p className="text-sm text-gray-600 dark:text-gray-400">{inq.message}</p>
                      <p className="text-xs text-gray-400 mt-2">{new Date(inq.created_at).toLocaleString()}</p>
                    </div>
                    <select
                      value={inq.status}
                      onChange={(e) => updateInquiryStatus(inq.id, e.target.value)}
                      className="input text-sm py-2 shrink-0"
                    >
                      <option value="New">New</option>
                      <option value="Read">Read</option>
                      <option value="Responded">Responded</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              ))}
              {inquiries.length === 0 && <p className="text-gray-400 text-center py-12">No inquiries yet</p>}
            </div>
          </div>
        )}

        {/* Testimonials tab */}
        {tab === 'testimonials' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Testimonials ({testimonials.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testimonials.map((t) => (
                <div key={t.id} className="card p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{t.customer_name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{t.location} - {t.rating} stars</div>
                    </div>
                    <button onClick={() => deleteTestimonial(t.id)} className="p-1.5 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/30">
                      <Trash2 className="w-4 h-4 text-error-500" />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{t.message}"</p>
                </div>
              ))}
              {testimonials.length === 0 && <p className="text-gray-400 text-center py-12 col-span-2">No testimonials yet</p>}
            </div>
          </div>
        )}

        {/* Gallery tab */}
        {tab === 'gallery' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Gallery ({gallery.length})</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="card overflow-hidden group relative">
                  <img src={g.image} alt={g.title} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{g.title}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{g.category}</div>
                  </div>
                  <button
                    onClick={() => deleteGalleryItem(g.id)}
                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-error-500 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {gallery.length === 0 && <p className="text-gray-400 text-center py-12 col-span-full">No gallery items yet</p>}
            </div>
          </div>
        )}

        {/* Categories tab */}
        {tab === 'categories' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Categories ({categories.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((c) => (
                <div key={c.id} className="card p-5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">{c.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{c.description}</div>
                  </div>
                  <button onClick={() => deleteCategory(c.id)} className="p-2 rounded-lg hover:bg-error-50 dark:hover:bg-error-950/30">
                    <Trash2 className="w-4 h-4 text-error-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Product modal component
function ProductModal({
  product,
  categories,
  onClose,
  onSaved,
}: {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSaved: () => void;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    availability: product?.availability || 'In Stock',
    brand: product?.brand || '',
    category_id: product?.category_id || '',
    images: (product?.images || []).join(', '),
    features: (product?.features || []).join(', '),
    warranty: product?.warranty || '',
    is_featured: product?.is_featured || false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setForm({ ...form, [e.target.name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const slug = form.slug || form.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const images = form.images.split(',').map((s) => s.trim()).filter(Boolean);
    const features = form.features.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: form.name,
      slug,
      description: form.description,
      price: parseFloat(String(form.price)) || 0,
      availability: form.availability,
      brand: form.brand || null,
      category_id: form.category_id || null,
      images,
      features,
      warranty: form.warranty || null,
      is_featured: form.is_featured,
    };

    let result;
    if (product) {
      result = await supabase.from('products').update(payload).eq('id', product.id);
    } else {
      result = await supabase.from('products').insert(payload);
    }

    if (result.error) {
      setError(result.error.message);
      setSaving(false);
    } else {
      onSaved();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5" />
          </button>
        </div>
        {error && <div className="mb-4 p-3 rounded-lg bg-error-50 dark:bg-error-950/30 text-error-700 dark:text-error-400 text-sm">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="label">Brand</label>
              <input name="brand" value={form.brand} onChange={handleChange} className="input" />
            </div>
          </div>
          <div>
            <label className="label">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="input resize-none" />
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="label">Price (KSh) *</label>
              <input name="price" type="number" value={form.price} onChange={handleChange} required className="input" />
            </div>
            <div>
              <label className="label">Availability</label>
              <select name="availability" value={form.availability} onChange={handleChange} className="input">
                <option value="In Stock">In Stock</option>
                <option value="Out of Stock">Out of Stock</option>
                <option value="Pre-Order">Pre-Order</option>
              </select>
            </div>
            <div>
              <label className="label">Category</label>
              <select name="category_id" value={form.category_id} onChange={handleChange} className="input">
                <option value="">None</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="label">Image URLs (comma-separated)</label>
            <input name="images" value={form.images} onChange={handleChange} className="input" placeholder="https://..." />
          </div>
          <div>
            <label className="label">Features (comma-separated)</label>
            <input name="features" value={form.features} onChange={handleChange} className="input" placeholder="Feature 1, Feature 2" />
          </div>
          <div>
            <label className="label">Warranty</label>
            <input name="warranty" value={form.warranty} onChange={handleChange} className="input" placeholder="e.g. 1 year warranty" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="is_featured" checked={form.is_featured} onChange={handleChange} className="w-4 h-4 rounded" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Featured product</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={saving} className="btn-primary flex-1 disabled:opacity-60">
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Save Product'}
            </button>
            <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
