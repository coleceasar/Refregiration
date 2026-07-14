import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ServicesPage from './pages/ServicesPage';
import GalleryPage from './pages/GalleryPage';
import FAQPage from './pages/FAQPage';
import BookingPage from './pages/BookingPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function Router() {
  const { route } = useApp();
  const cleanRoute = route.split('?')[0];

  // Product detail
  if (cleanRoute.startsWith('/products/')) {
    const slug = cleanRoute.replace('/products/', '');
    return <ProductDetailPage slug={slug} />;
  }

  switch (cleanRoute) {
    case '/':
      return <HomePage />;
    case '/about':
      return <AboutPage />;
    case '/products':
      return <ProductsPage />;
    case '/services':
      return <ServicesPage />;
    case '/gallery':
      return <GalleryPage />;
    case '/faq':
      return <FAQPage />;
    case '/booking':
      return <BookingPage />;
    case '/contact':
      return <ContactPage />;
    case '/admin':
      return <AdminPage />;
    default:
      return <HomePage />;
  }
}

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950 transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Router />
        </main>
        <Footer />
        <FloatingButtons />
      </div>
    </AppProvider>
  );
}

export default App;
