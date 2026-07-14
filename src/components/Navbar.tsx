import { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Menu,
  X,
  Moon,
  Sun,
  Search,
  Phone,
  Snowflake,
} from 'lucide-react';

const navLinks = [
  { label: 'Home', route: '/' },
  { label: 'About', route: '/about' },
  { label: 'Products', route: '/products' },
  { label: 'Services', route: '/services' },
  { label: 'Gallery', route: '/gallery' },
  { label: 'FAQ', route: '/faq' },
  { label: 'Contact', route: '/contact' },
];

export default function Navbar() {
  const { darkMode, toggleDarkMode, route, navigate } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setMobileOpen(false);
    }
  };

  const go = (r: string) => {
    navigate(r);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Top bar */}
      <div className="hidden md:block bg-primary-900 text-white text-sm">
        <div className="container-custom flex items-center justify-between py-2">
          <div className="flex items-center gap-6">
            <a href="tel:+254700000000" className="flex items-center gap-2 hover:text-primary-200 transition-colors">
              <Phone className="w-3.5 h-3.5" />
              +254 700 000 000
            </a>
            <span className="text-primary-200">Mon - Sat: 8:00 AM - 6:00 PM</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => go('/booking')} className="hover:text-primary-200 transition-colors">
              Book a Repair
            </button>
          </div>
        </div>
      </div>

      <nav
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-lg'
            : 'bg-white dark:bg-gray-950'
        }`}
      >
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button onClick={() => go('/')} className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                <Snowflake className="w-6 h-6 md:w-7 md:h-7 text-white" />
              </div>
              <div className="text-left">
                <div className="font-display font-bold text-sm md:text-base text-gray-900 dark:text-white leading-tight">
                  Wapendwa
                </div>
                <div className="text-[10px] md:text-xs text-gray-500 dark:text-gray-400 leading-tight">
                  Refrigeration & AC
                </div>
              </div>
            </button>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.route}
                  onClick={() => go(link.route)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    route === link.route
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                onClick={() => go('/booking')}
                className="hidden sm:inline-flex btn-primary text-sm py-2.5"
              >
                Book a Repair
              </button>
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Menu"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Search bar */}
          {searchOpen && (
            <form onSubmit={handleSearch} className="pb-4 animate-fade-in">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products, services..."
                  className="input pl-12"
                  autoFocus
                />
              </div>
            </form>
          )}

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="lg:hidden pb-4 animate-fade-in-up">
              <div className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <button
                    key={link.route}
                    onClick={() => go(link.route)}
                    className={`px-4 py-3 rounded-lg text-left text-sm font-medium transition-all ${
                      route === link.route
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/50'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button onClick={() => go('/booking')} className="btn-primary text-sm mt-2">
                  Book a Repair
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
