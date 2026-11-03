import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  MessageCircle, 
  Truck, 
  Menu, 
  X, 
  ChevronDown, 
  Church,
  ShieldCheck,
  MapPin,
  Lock
} from 'lucide-react';
import { useStore } from '../lib/store';

export const Header: React.FC = () => {
  const {
    cart,
    wishlist,
    settings,
    products,
    categories,
    brands,
    searchQuery,
    setSearchQuery,
    setIsCartOpen,
    navigateToHome,
    navigateToCategory,
    navigateToBrand,
    navigateToProduct,
    setCurrentView,
    openAdminLogin,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [brandsDropdownOpen, setBrandsDropdownOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const searchResults = searchQuery.trim().length > 1
    ? products
        .filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchFocused(false);
      setCurrentView('catalog');
    }
  };

  const handleWhatsAppClick = () => {
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      'Olá Wisbeck Company! Gostaria de tirar dúvidas com um consultor técnico sobre produtos de som.'
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-colors">
      {/* Top Wisbeck Signature Gradient Bar */}
      <div className="h-[3px] w-full bg-wisbeck-gradient" />

      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-[11px] font-medium py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-orange-400" />
              <span>Showroom em Itajaí/SC</span>
            </span>
            <span className="hidden md:inline text-slate-600">•</span>
            <span className="hidden md:inline text-slate-300 font-normal">{settings.topAnnouncement}</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCurrentView('orders-tracker')}
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5 text-amber-400" />
              <span>Rastrear Pedido</span>
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => setCurrentView('contact')}
              className="hover:text-white transition-colors"
            >
              Fale Conosco
            </button>
            <span className="text-slate-700">|</span>
            <button
              type="button"
              onClick={() => openAdminLogin()}
              className="hover:text-white transition-colors flex items-center gap-1 text-slate-400 hover:text-white"
              title="Acesso Administrativo"
            >
              <Lock className="w-3.5 h-3.5 text-orange-400" />
              <span>Área Admin</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-6">
        
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-slate-900 rounded-lg hover:bg-slate-100"
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Wordmark & Official Logo */}
        <div
          onClick={navigateToHome}
          className="cursor-pointer flex items-center gap-3 shrink-0 transition-opacity hover:opacity-90"
        >
          <img
            src="https://i.postimg.cc/7YZqgm6W/Logo-corporativo-WISBECK-com-gradiente-colorido.png"
            alt="Wisbeck Company - Som Profissional & Instrumentos Musicais"
            className="h-10 sm:h-11 w-auto object-contain"
          />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Buscar por microfone, mesa digital, violão, caixa acústica..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 250)}
              className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 text-xs rounded-xl pl-10 pr-24 py-2.5 border border-slate-200 hover:border-slate-300 focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 focus:outline-none transition-all duration-200 shadow-xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            
            <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              <kbd className="hidden sm:inline-block text-[10px] text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded font-mono border border-slate-300/40">
                ⌘K
              </kbd>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-colors active:scale-95 shadow-xs"
              >
                Buscar
              </button>
            </div>
          </form>

          {/* Search suggestions dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="p-2.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3.5 flex items-center justify-between">
                <span>Produtos sugeridos</span>
                <span className="text-slate-400 font-normal">Pressione Enter para ver todos</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      navigateToProduct(item.id);
                      setIsSearchFocused(false);
                    }}
                    className="p-3 flex items-center gap-3.5 hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-11 h-11 object-contain rounded-lg bg-white border border-slate-200/80 p-1 group-hover:scale-105 transition-transform"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 group-hover:text-orange-600 transition-colors truncate">{item.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.brand} • <span className="font-bold text-slate-950 font-heading">R$ {item.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* WhatsApp Specialist Link */}
          <button
            type="button"
            onClick={handleWhatsAppClick}
            className="hidden sm:flex items-center gap-2.5 px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200/90 hover:bg-emerald-100/80 hover:border-emerald-300 transition-all duration-200 text-xs font-semibold shadow-xs active:scale-[0.98]"
            title="Fale com nosso consultor técnico"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MessageCircle className="w-4 h-4" />
            </div>
            <div className="text-left hidden lg:block leading-tight">
              <span className="block text-[10px] text-emerald-700 font-medium">Consultoria Técnica</span>
              <span className="font-bold">{settings.whatsapp}</span>
            </div>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={() => setCurrentView('catalog')}
            className="p-2.5 text-slate-600 hover:text-slate-950 rounded-xl hover:bg-slate-100 transition-all relative active:scale-95"
            title="Favoritos"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute 1 top-1 right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2.5 bg-slate-950 text-white hover:bg-slate-900 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 shadow-md shadow-slate-950/15 hover:shadow-lg active:scale-[0.98]"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-75">
                  {cartItemCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline">Carrinho</span>
            {cartSubtotal > 0 && (
              <span className="hidden md:inline font-bold border-l border-slate-700 pl-2 font-heading">
                R$ {cartSubtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </button>
        </div>

      </div>

      {/* Mobile Search Input */}
      <div className="px-4 pb-3 md:hidden">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs rounded-lg pl-9 pr-16 py-2 border border-slate-200 focus:outline-none focus:border-slate-900"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-1 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-semibold px-2.5 py-1 rounded"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Category Sub-Bar (Desktop) */}
      <nav className="hidden lg:block border-t border-slate-100 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs font-medium text-slate-700">
          
          <div className="flex items-center">
            {/* Categorias button */}
            <div className="relative">
              <button
                onClick={() => setCategoriesDropdownOpen(!categoriesDropdownOpen)}
                onMouseEnter={() => setCategoriesDropdownOpen(true)}
                className="flex items-center gap-1.5 py-2.5 px-3 font-semibold text-slate-900 hover:text-orange-600 transition-colors"
              >
                <span>Todas as Categorias</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {categoriesDropdownOpen && (
                <div
                  onMouseLeave={() => setCategoriesDropdownOpen(false)}
                  className="absolute left-0 top-full w-64 bg-white border border-slate-200 rounded-lg shadow-lg py-1.5 z-50 divide-y divide-slate-100"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        navigateToCategory(cat.slug);
                        setCategoriesDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium flex items-center justify-between"
                    >
                      <span>{cat.name}</span>
                      <span className="text-slate-400 text-[10px]">›</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => navigateToCategory('audio-profissional')}
              className="py-2.5 px-3 hover:text-orange-600 transition-colors"
            >
              Áudio Profissional
            </button>
            <button
              onClick={() => navigateToCategory('instrumentos-musicais')}
              className="py-2.5 px-3 hover:text-orange-600 transition-colors"
            >
              Instrumentos Musicais
            </button>

            {/* Special Church link */}
            <button
              onClick={() => setCurrentView('church-solutions')}
              className="py-2.5 px-3 text-orange-700 hover:text-orange-800 font-semibold flex items-center gap-1 transition-colors"
            >
              <Church className="w-3.5 h-3.5 text-orange-600" />
              <span>Soluções para Igrejas</span>
            </button>

            <button
              onClick={() => navigateToCategory('som-ambiente')}
              className="py-2.5 px-3 hover:text-orange-600 transition-colors"
            >
              Som Ambiente
            </button>
            <button
              onClick={() => navigateToCategory('home-studio')}
              className="py-2.5 px-3 hover:text-orange-600 transition-colors"
            >
              Home Studio & Podcast
            </button>

            {/* Brands Dropdown */}
            <div className="relative">
              <button
                onMouseEnter={() => setBrandsDropdownOpen(true)}
                onClick={() => setBrandsDropdownOpen(!brandsDropdownOpen)}
                className="flex items-center gap-1 py-2.5 px-3 hover:text-orange-600 transition-colors"
              >
                <span>Marcas</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {brandsDropdownOpen && (
                <div
                  onMouseLeave={() => setBrandsDropdownOpen(false)}
                  className="absolute left-0 top-full w-56 bg-white border border-slate-200 rounded-lg shadow-lg p-2 z-50 grid grid-cols-2 gap-1"
                >
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => {
                        navigateToBrand(b.name);
                        setBrandsDropdownOpen(false);
                      }}
                      className="text-left text-xs p-1.5 rounded hover:bg-slate-100 text-slate-700 hover:text-slate-900 truncate"
                    >
                      {b.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <button onClick={() => setCurrentView('about')} className="hover:text-slate-900 transition-colors">
              Quem Somos
            </button>
            <button onClick={() => setCurrentView('contact')} className="hover:text-slate-900 transition-colors">
              Showroom Itajaí
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Categorias</div>
          <div className="flex flex-col gap-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  navigateToCategory(cat.slug);
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 px-3 rounded-md hover:bg-slate-100 text-slate-800 font-medium"
              >
                {cat.name}
              </button>
            ))}
            <button
              onClick={() => {
                setCurrentView('church-solutions');
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-md bg-orange-50 text-orange-800 font-semibold flex items-center gap-2"
            >
              <Church className="w-4 h-4 text-orange-600" />
              Soluções para Igrejas & Templos
            </button>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2 text-xs text-slate-600">
            <button
              onClick={() => {
                setCurrentView('orders-tracker');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 py-1 hover:text-slate-900"
            >
              <Truck className="w-4 h-4 text-orange-600" />
              Rastrear Pedido Correios
            </button>
            <button
              onClick={() => {
                setCurrentView('about');
                setMobileMenuOpen(false);
              }}
              className="text-left py-1 hover:text-slate-900"
            >
              Quem Somos (Itajaí/SC)
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
