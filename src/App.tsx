import { BottomNav } from './components/BottomNav';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { IntroSplash } from './components/IntroSplash';
import { StoreProvider, useStore } from './context/StoreContext';
import { CategoriesPage } from './pages/CategoriesPage';
import { ComparePage } from './pages/ComparePage';
import { HomePage } from './pages/HomePage';
import { MaintenancePage } from './pages/MaintenancePage';
import { OrdersPage } from './pages/OrdersPage';
import { PerfectBikeQuizPage } from './pages/PerfectBikeQuizPage';
import { PerfectBikeResultPage } from './pages/PerfectBikeResultPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { ProductsPage } from './pages/ProductsPage';
import { ProfilePage } from './pages/ProfilePage';

function StoreShell() {
  const { route } = useStore();

  const renderPage = () => {
    switch (route) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'maintenance':
        return <MaintenancePage />;
      case 'orders':
        return <OrdersPage />;
      case 'compare':
        return <ComparePage />;
      case 'profile':
        return <ProfilePage />;
      case 'product-detail':
        return <ProductDetailPage />;
      case 'perfect-bike-quiz':
        return <PerfectBikeQuizPage />;
      case 'perfect-bike-result':
        return <PerfectBikeResultPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 text-zinc-950 dark:text-zinc-50 transition-colors duration-200">
      <IntroSplash />
      <Header />
      <main className="flex-1 w-full">{renderPage()}</main>
      <Footer />
      <BottomNav />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <StoreShell />
    </StoreProvider>
  );
}
