import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { CatalogView } from './components/CatalogView';
import { ProductDetailView } from './components/ProductDetailView';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { SolucoesIgrejasView } from './components/SolucoesIgrejasView';
import { QuemSomosView } from './components/QuemSomosView';
import { OrdersTrackerView } from './components/OrdersTrackerView';
import { AdminView } from './components/AdminView';
import { useStore } from './lib/store';
import { CheckCircle2, Info, AlertTriangle } from 'lucide-react';

export default function App() {
  const { currentView, selectedProductId, toastMessage, setCurrentView } = useStore();

  // Listen to browser hash or URL path for /admin direct navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        setCurrentView('admin');
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className={`px-4 py-2.5 rounded-xl shadow-xl border text-xs font-semibold flex items-center gap-2.5 backdrop-blur-md ${
            toastMessage.type === 'success'
              ? 'bg-white border-emerald-300 text-emerald-900'
              : toastMessage.type === 'error'
              ? 'bg-white border-rose-300 text-rose-900'
              : 'bg-white border-slate-200 text-slate-800'
          }`}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-blue-600 shrink-0" />}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Render Admin directly without customer header/footer if in admin view */}
      {currentView === 'admin' ? (
        <AdminView />
      ) : (
        <>
          {/* Main Store Header */}
          <Header />

          {/* Dynamic Content Views */}
          <main className="flex-1">
            {currentView === 'home' && <HomeView />}
            {currentView === 'catalog' && <CatalogView />}
            {currentView === 'product' && selectedProductId && (
              <ProductDetailView productId={selectedProductId} />
            )}
            {currentView === 'checkout' && <CheckoutView />}
            {currentView === 'church-solutions' && <SolucoesIgrejasView />}
            {currentView === 'about' && <QuemSomosView />}
            {currentView === 'contact' && <QuemSomosView />}
            {currentView === 'orders-tracker' && <OrdersTrackerView />}
          </main>

          {/* Main Store Footer */}
          <Footer />
        </>
      )}

    </div>
  );
}
