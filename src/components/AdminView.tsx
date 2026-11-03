import React, { useState } from 'react';
import { 
  Lock, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Tag, 
  Share2, 
  Settings, 
  FileText, 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Search, 
  TrendingUp, 
  DollarSign, 
  Save, 
  X, 
  MessageCircle, 
  Download,
  AlertTriangle,
  Layers,
  FolderPlus,
  Speaker,
  Music,
  Church,
  Volume2,
  Mic,
  Cable
} from 'lucide-react';
import { Product, Order, Coupon, StoreSettings, Category } from '../types';
import { useStore } from '../lib/store';
import { uploadToVercelBlob } from '../lib/blob';

export const AdminView: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    settings,
    isAdminLoggedIn,
    adminLogin,
    adminLogout,
    saveProduct,
    deleteProduct,
    saveCategory,
    deleteCategory,
    updateOrderStatus,
    saveCoupon,
    deleteCoupon,
    saveSettings,
    navigateToHome,
    showToast,
  } = useStore();

  const [loginEmail, setLoginEmail] = useState('admin@x.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'categories' | 'orders' | 'coupons' | 'social' | 'cms' | 'reports'>('dashboard');

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [categorySearch, setCategorySearch] = useState('');
  const [subcategoriesInput, setSubcategoriesInput] = useState('');
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  const [cmsSettings, setCmsSettings] = useState<StoreSettings>(settings);
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(loginEmail, loginPassword);
    if (!success) {
      setLoginError('Credenciais inválidas. Use admin@x.com e admin4321.');
    }
  };

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mx-auto border border-orange-200">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-slate-950 font-heading">
              Painel de Gestão Wisbeck
            </h2>
            <p className="text-xs text-slate-500">
              Acesso restrito para administração do e-commerce.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            {loginError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">E-mail Administrativo</label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@x.com"
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-700 font-semibold">Senha</label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors shadow-xs"
            >
              Acessar Painel
            </button>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <p className="font-semibold text-slate-800">Credenciais Administrativas Oficiais:</p>
              <p>E-mail: <strong className="text-slate-950">admin@x.com</strong></p>
              <p>Senha: <strong className="text-slate-950">admin4321</strong></p>
              <button
                type="button"
                onClick={() => {
                  setLoginEmail('admin@x.com');
                  setLoginPassword('admin4321');
                  adminLogin('admin@x.com', 'admin4321');
                }}
                className="w-full mt-2 py-1.5 px-3 rounded bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 font-bold text-center block transition-colors"
              >
                Entrar Automaticamente como Admin
              </button>
            </div>
          </form>

          <div className="text-center">
            <button
              onClick={navigateToHome}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              ← Voltar para a Loja Virtual
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Dashboard Metrics
  const totalSales = orders
    .filter((o) => o.status !== 'cancelled')
    .reduce((acc, o) => acc + o.total, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const paidOrdersCount = orders.filter((o) => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').length;
  const totalProductsStock = products.reduce((acc, p) => acc + p.stock, 0);

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) {
      showToast('Preencha os campos obrigatórios do produto.', 'error');
      return;
    }

    const id = editingProduct.id || `prod-${Date.now()}`;
    const slug = editingProduct.slug || editingProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const images = editingProduct.images && editingProduct.images.length > 0
      ? editingProduct.images
      : ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop'];

    const fullProduct: Product = {
      id,
      name: editingProduct.name,
      slug,
      category: editingProduct.category || 'Áudio Profissional',
      categorySlug: editingProduct.categorySlug || 'audio-profissional',
      brand: editingProduct.brand || 'Shure',
      price: Number(editingProduct.price),
      originalPrice: editingProduct.originalPrice ? Number(editingProduct.originalPrice) : undefined,
      pixDiscountPercent: editingProduct.pixDiscountPercent || 10,
      stock: Number(editingProduct.stock || 10),
      images,
      description: editingProduct.description || 'Descrição completa do produto.',
      technicalSpecs: editingProduct.technicalSpecs || { 'Garantia': '12 meses oficial' },
      featured: editingProduct.featured || false,
      isBestSeller: editingProduct.isBestSeller || false,
      isNewRelease: editingProduct.isNewRelease || false,
      isChurchSpecial: editingProduct.isChurchSpecial || false,
      rating: editingProduct.rating || 5.0,
      reviewsCount: editingProduct.reviewsCount || 1,
      weightKg: Number(editingProduct.weightKg || 2),
      dimensionsCm: editingProduct.dimensionsCm || { height: 20, width: 20, depth: 20 },
    };

    await saveProduct(fullProduct);
    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      const url = await uploadToVercelBlob(file, `wisbeck-${Date.now()}-${file.name}`);
      setEditingProduct((prev) => ({
        ...prev,
        images: prev?.images ? [...prev.images, url] : [url],
      }));
      showToast('Imagem carregada no Vercel Blob!', 'success');
    } catch (err) {
      showToast('Erro ao processar imagem.', 'error');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon?.code || !editingCoupon?.value) return;

    const fullCoupon: Coupon = {
      id: editingCoupon.id || `cupom-${Date.now()}`,
      code: editingCoupon.code.toUpperCase().trim(),
      discountType: editingCoupon.discountType || 'percentage',
      value: Number(editingCoupon.value),
      minOrderValue: Number(editingCoupon.minOrderValue || 0),
      validUntil: editingCoupon.validUntil || '2026-12-31',
      usageLimit: Number(editingCoupon.usageLimit || 100),
      timesUsed: editingCoupon.timesUsed || 0,
      active: editingCoupon.active ?? true,
    };

    saveCoupon(fullCoupon);
    setIsCouponModalOpen(false);
    setEditingCoupon(null);
  };

  const exportOrdersCSV = () => {
    const headers = 'Código,Data,Cliente,WhatsApp,Email,Cidade,Estado,Total,Pagamento,Status\n';
    const rows = orders.map((o) =>
      `"${o.code}","${o.createdAt.slice(0, 10)}","${o.customer.name}","${o.customer.phone}","${o.customer.email}","${o.address.city}","${o.address.state}","${o.total.toFixed(2)}","${o.paymentMethod}","${o.status}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `relatorio_pedidos_wisbeck_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Relatório de vendas exportado com sucesso!', 'success');
  };

  const exportProductsCSV = () => {
    const headers = 'ID,Nome,Marca,Categoria,Preço,Estoque,Mais Vendido,Para Igrejas\n';
    const rows = products.map((p) =>
      `"${p.id}","${p.name.replace(/"/g, '""')}","${p.brand}","${p.category}","${p.price.toFixed(2)}","${p.stock}","${p.isBestSeller ? 'Sim' : 'Não'}","${p.isChurchSpecial ? 'Sim' : 'Não'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `inventario_wisbeck_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Inventário exportado em CSV!', 'success');
  };

  const handleOpenNewCategory = () => {
    setEditingCategory({
      name: '',
      slug: '',
      iconName: 'Speaker',
      description: '',
      subcategories: [],
    });
    setSubcategoriesInput('');
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category) => {
    setEditingCategory({
      ...cat,
      subcategories: [...cat.subcategories],
    });
    setSubcategoriesInput(cat.subcategories.join(', '));
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name?.trim()) {
      showToast('Nome da categoria é obrigatório.', 'error');
      return;
    }

    const name = editingCategory.name.trim();
    const slug = (editingCategory.slug || name)
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const parsedSubcategories = subcategoriesInput
      ? subcategoriesInput
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean)
      : (editingCategory.subcategories || []);

    const fullCategory: Category = {
      id: editingCategory.id || `cat-${Date.now()}`,
      name,
      slug,
      iconName: editingCategory.iconName || 'Speaker',
      description: editingCategory.description?.trim() || '',
      subcategories: parsedSubcategories,
    };

    saveCategory(fullCategory);
    setIsCategoryModalOpen(false);
    setEditingCategory(null);
  };

  const handleConfirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    deleteCategory(categoryToDelete.id);
    setCategoryToDelete(null);
  };

  const getCategoryProductCount = (categorySlug: string, categoryName: string) => {
    return products.filter(
      (p) => p.categorySlug === categorySlug || p.category.toLowerCase() === categoryName.toLowerCase()
    ).length;
  };

  const filteredCategories = categories.filter((c) => {
    if (!categorySearch.trim()) return true;
    const q = categorySearch.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.subcategories.some((sub) => sub.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 px-6 py-3 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <img
            src="https://i.postimg.cc/7YZqgm6W/Logo-corporativo-WISBECK-com-gradiente-colorido.png"
            alt="Wisbeck Company"
            className="h-8 w-auto object-contain"
          />
          <div className="hidden sm:block border-l border-slate-200 pl-3">
            <span className="text-xs font-bold text-slate-900 block leading-tight">
              Painel de Controle
            </span>
            <span className="text-[10px] text-slate-500">
              admin@x.com • Showroom Itajaí/SC
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button
            onClick={navigateToHome}
            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold border border-slate-200 transition-colors"
          >
            Ver Loja Virtual
          </button>

          <button
            onClick={adminLogout}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 transition-colors"
            title="Sair do painel"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-60 bg-white border-r border-slate-200 p-3 space-y-1 shrink-0 text-xs font-medium">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1.5">
            Menu Principal
          </div>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard & Métricas</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'products'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Package className="w-4 h-4" />
              <span>Produtos & Catálogo</span>
            </div>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'categories'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-orange-600" />
              <span>Categorias do Site</span>
            </div>
            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-medium">
              {categories.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'orders'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Pedidos de Clientes</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'coupons'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Gerador de Cupons</span>
          </button>

          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 pt-3 pb-1">
            Loja & CMS
          </div>

          <button
            onClick={() => setActiveTab('cms')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'cms'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Configurações & CMS</span>
          </button>

          <button
            onClick={() => setActiveTab('social')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'social'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>Redes & Atendimento</span>
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors ${
              activeTab === 'reports'
                ? 'bg-slate-900 text-white font-semibold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Relatórios em CSV</span>
          </button>
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                  Dashboard de Desempenho
                </h1>
                <p className="text-xs text-slate-500">
                  Visão consolidada de faturamento, pedidos e produtos em tempo real.
                </p>
              </div>

              {/* Metric Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Faturamento Total</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-950 font-heading">
                    R$ {totalSales.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-emerald-700 font-semibold">+18.4% este mês</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Pedidos Totais</span>
                    <ShoppingBag className="w-4 h-4 text-orange-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-950 font-heading">
                    {orders.length}
                  </p>
                  <p className="text-[11px] text-slate-500">{paidOrdersCount} pagos / {pendingOrdersCount} pendentes</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Estoque Total</span>
                    <Package className="w-4 h-4 text-amber-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-950 font-heading">
                    {totalProductsStock} un.
                  </p>
                  <p className="text-[11px] text-slate-500">Em {products.length} produtos cadastrados</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-1">
                  <div className="flex items-center justify-between text-slate-500 text-xs">
                    <span>Ticket Médio</span>
                    <TrendingUp className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-2xl font-bold text-slate-950 font-heading">
                    R$ {(orders.length > 0 ? totalSales / orders.length : 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-slate-500">Demanda alta em som para igrejas</p>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-sm text-slate-900 font-heading">
                    Pedidos Recentes
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-orange-600 hover:underline font-semibold"
                  >
                    Ver Todos →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider">
                      <tr>
                        <th className="p-2.5">Código</th>
                        <th className="p-2.5">Cliente</th>
                        <th className="p-2.5">Valor</th>
                        <th className="p-2.5">Pagamento</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{ord.code}</td>
                          <td className="p-2.5">{ord.customer.name}</td>
                          <td className="p-2.5 font-semibold text-slate-950">
                            R$ {ord.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </td>
                          <td className="p-2.5">{ord.paymentMethod}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                              ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Categorias & Departamentos Overview */}
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-950 font-heading">
                        Departamentos & Categorias Ativas
                      </h3>
                      <p className="text-[11px] text-slate-500">
                        Total de {categories.length} categorias cadastradas para navegação e organização do catálogo.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="text-xs text-orange-600 hover:text-orange-700 font-semibold self-start sm:self-auto flex items-center gap-1"
                  >
                    <span>Gerenciar Categorias</span>
                    <span>→</span>
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
                  {categories.map((cat) => {
                    const count = getCategoryProductCount(cat.slug, cat.name);
                    return (
                      <div
                        key={cat.id}
                        onClick={() => setActiveTab('categories')}
                        className="p-3 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50 transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <span className="font-semibold text-slate-900 text-xs line-clamp-1 block mb-1">
                          {cat.name}
                        </span>
                        <div className="flex items-center justify-between text-[11px] text-slate-500">
                          <span>Produtos</span>
                          <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                            {count}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                    Gestão de Produtos ({products.length})
                  </h1>
                  <p className="text-xs text-slate-500">
                    Edite dados de estoque, preços e imagens via Vercel Blob.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingProduct({
                      name: '',
                      price: 0,
                      stock: 10,
                      brand: 'Shure',
                      category: 'Áudio Profissional',
                      categorySlug: 'audio-profissional',
                      pixDiscountPercent: 10,
                      images: [],
                      technicalSpecs: {},
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Produto</span>
                </button>
              </div>

              {/* Search */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filtrar por nome ou marca..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full bg-white text-xs text-slate-900 placeholder:text-slate-400 pl-8 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="p-3">Foto</th>
                        <th className="p-3">Nome do Produto</th>
                        <th className="p-3">Marca</th>
                        <th className="p-3">Categoria</th>
                        <th className="p-3">Preço</th>
                        <th className="p-3">Estoque</th>
                        <th className="p-3 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products
                        .filter((p) =>
                          p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
                          p.brand.toLowerCase().includes(productSearch.toLowerCase())
                        )
                        .map((prod) => (
                          <tr key={prod.id} className="hover:bg-slate-50">
                            <td className="p-3">
                              <img src={prod.images[0]} alt="" className="w-9 h-9 object-contain rounded bg-slate-50 border border-slate-200 p-0.5" />
                            </td>
                            <td className="p-3 font-semibold text-slate-900 max-w-xs truncate">{prod.name}</td>
                            <td className="p-3 font-medium text-slate-600">{prod.brand}</td>
                            <td className="p-3 text-slate-600">{prod.category}</td>
                            <td className="p-3 font-bold text-slate-950">
                              R$ {prod.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                prod.stock < 5 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {prod.stock} un.
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1">
                              <button
                                onClick={() => {
                                  setEditingProduct(prod);
                                  setIsProductModalOpen(true);
                                }}
                                className="p-1.5 hover:bg-slate-100 text-slate-600 rounded"
                                title="Editar"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Remover "${prod.name}"?`)) {
                                    deleteProduct(prod.id);
                                  }
                                }}
                                className="p-1.5 hover:bg-rose-50 text-rose-600 rounded"
                                title="Excluir"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                    Gestão de Pedidos ({orders.length})
                  </h1>
                  <p className="text-xs text-slate-500">
                    Atualize status e adicione código de rastreamento dos Correios.
                  </p>
                </div>

                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-white text-xs text-slate-900 p-2 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="all">Todos os Status</option>
                  <option value="pending">Pendente</option>
                  <option value="paid">Pago</option>
                  <option value="shipped">Enviado</option>
                  <option value="delivered">Entregue</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              </div>

              <div className="space-y-3">
                {orders
                  .filter((o) => orderStatusFilter === 'all' || o.status === orderStatusFilter)
                  .map((ord) => (
                    <div
                      key={ord.id}
                      className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-950 text-sm">{ord.code}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ord.status === 'paid' ? 'bg-emerald-100 text-emerald-800' :
                            ord.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600">
                          {ord.customer.name} • {ord.customer.phone} • {ord.address.city}/{ord.address.state}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {ord.items.length} itens • Envio: {ord.freightOption.name}
                          {ord.trackingCode && <span className="text-blue-700 font-bold ml-2">Rastreio: {ord.trackingCode}</span>}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                        <div className="text-right">
                          <p className="text-[10px] text-slate-400">Total</p>
                          <p className="text-sm font-bold text-slate-950">
                            R$ {ord.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </p>
                        </div>

                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as Order['status'])}
                          className="bg-slate-50 text-xs text-slate-800 p-1.5 rounded border border-slate-300 focus:outline-none"
                        >
                          <option value="pending">Pendente</option>
                          <option value="paid">Pago</option>
                          <option value="processing">Em Separação</option>
                          <option value="shipped">Enviado</option>
                          <option value="delivered">Entregue</option>
                          <option value="cancelled">Cancelado</option>
                        </select>

                        <a
                          href={`https://wa.me/55${ord.customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Olá ${ord.customer.name}! Estamos entrando em contato da Wisbeck Company sobre seu pedido ${ord.code}.`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
                          title="Chamar cliente no WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                    Gerador de Cupons
                  </h1>
                  <p className="text-xs text-slate-500">
                    Gerencie cupons de desconto para clientes e igrejas.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditingCoupon({
                      code: '',
                      discountType: 'percentage',
                      value: 10,
                      minOrderValue: 200,
                      validUntil: '2026-12-31',
                      usageLimit: 100,
                      active: true,
                    });
                    setIsCouponModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 text-white font-semibold text-xs rounded-lg hover:bg-slate-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Cupom</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {coupons.map((c) => (
                  <div key={c.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm tracking-wider">{c.code}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {c.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </div>

                    <p className="text-xl font-bold text-slate-950 font-heading">
                      {c.discountType === 'percentage' ? `${c.value}% OFF` : `R$ ${c.value} OFF`}
                    </p>

                    <div className="text-xs text-slate-500 space-y-0.5">
                      <p>Pedido mínimo: R$ {c.minOrderValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                      <p>Validade: {c.validUntil}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-end">
                      <button
                        onClick={() => deleteCoupon(c.id)}
                        className="text-xs text-rose-600 hover:underline"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: CMS */}
          {activeTab === 'cms' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                  Configurações Gerais da Loja (CMS)
                </h1>
                <p className="text-xs text-slate-500">
                  Edite o aviso do topo, política de frete grátis e horário de atendimento.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Aviso Superior (Top Bar)</label>
                  <input
                    type="text"
                    value={cmsSettings.topAnnouncement}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, topAnnouncement: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Frete Grátis a partir de (R$)</label>
                    <input
                      type="number"
                      value={cmsSettings.freeShippingThreshold}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, freeShippingThreshold: Number(e.target.value) })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Desconto PIX (%)</label>
                    <input
                      type="number"
                      value={cmsSettings.pixDiscountPercent}
                      onChange={(e) => setCmsSettings({ ...cmsSettings, pixDiscountPercent: Number(e.target.value) })}
                      className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Endereço Físico</label>
                  <input
                    type="text"
                    value={cmsSettings.address}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, address: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Horário de Funcionamento</label>
                  <input
                    type="text"
                    value={cmsSettings.openingHours}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, openingHours: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => saveSettings(cmsSettings)}
                  className="flex items-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Alterações</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 6: SOCIAL */}
          {activeTab === 'social' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                  Redes Sociais & Contatos
                </h1>
                <p className="text-xs text-slate-500">
                  Gerencie canais de contato com o cliente.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">WhatsApp de Atendimento Técnico</label>
                  <input
                    type="text"
                    value={cmsSettings.whatsapp}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, whatsapp: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Instagram (@)</label>
                  <input
                    type="text"
                    value={cmsSettings.instagram}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, instagram: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Telefone Showroom</label>
                  <input
                    type="text"
                    value={cmsSettings.phone}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, phone: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">E-mail</label>
                  <input
                    type="email"
                    value={cmsSettings.email}
                    onChange={(e) => setCmsSettings({ ...cmsSettings, email: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => saveSettings(cmsSettings)}
                  className="flex items-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Contatos</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 7: REPORTS */}
          {activeTab === 'reports' && (
            <div className="space-y-4 max-w-2xl">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
                  Exportação de Relatórios
                </h1>
                <p className="text-xs text-slate-500">
                  Baixe dados em formato CSV para Excel e planilhas.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Download className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Relatório de Vendas (CSV)</h3>
                  <p className="text-slate-500 text-[11px]">Lista completa de pedidos com dados do cliente e totais.</p>
                  <button
                    onClick={exportOrdersCSV}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Vendas</span>
                  </button>
                </div>

                <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                    <Package className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">Inventário de Produtos (CSV)</h3>
                  <p className="text-slate-500 text-[11px]">Planilha com todos os itens, estoque e preços.</p>
                  <button
                    onClick={exportProductsCSV}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Exportar Inventário</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CATEGORIES CRUD */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading flex items-center gap-2">
                    <Layers className="w-6 h-6 text-orange-600" />
                    <span>Gestão de Categorias & Departamentos</span>
                  </h1>
                  <p className="text-xs text-slate-500">
                    Cadastre, edite e remova categorias do site. Elas atualizam o menu de navegação, catálogo e filtros em tempo real.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenNewCategory}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-xs flex items-center gap-2 shadow-xs transition-colors self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  <span>Cadastrar Categoria</span>
                </button>
              </div>

              {/* Search & Stats Bar */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Buscar categoria por nome, slug ou subcategoria..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 text-slate-900 rounded-lg border border-slate-200 focus:bg-white focus:outline-none text-xs"
                  />
                  {categorySearch && (
                    <button
                      onClick={() => setCategorySearch('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <span className="font-semibold text-slate-900">{filteredCategories.length}</span>
                  <span>de {categories.length} categorias cadastradas</span>
                </div>
              </div>

              {/* Categories Table / Cards */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-700">
                    <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wider border-b border-slate-200">
                      <tr>
                        <th className="p-3.5">Categoria</th>
                        <th className="p-3.5">Slug / URL</th>
                        <th className="p-3.5">Descrição</th>
                        <th className="p-3.5">Subcategorias</th>
                        <th className="p-3.5 text-center">Produtos</th>
                        <th className="p-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCategories.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-8 text-center text-slate-400">
                            Nenhuma categoria encontrada para o termo pesquisado.
                          </td>
                        </tr>
                      ) : (
                        filteredCategories.map((cat) => {
                          const productCount = getCategoryProductCount(cat.slug, cat.name);
                          return (
                            <tr key={cat.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="p-3.5">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-lg bg-orange-50 border border-orange-200/80 flex items-center justify-center shrink-0">
                                    {cat.iconName === 'Music' && <Music className="w-4 h-4 text-amber-600" />}
                                    {cat.iconName === 'Church' && <Church className="w-4 h-4 text-purple-600" />}
                                    {cat.iconName === 'Volume2' && <Volume2 className="w-4 h-4 text-blue-600" />}
                                    {cat.iconName === 'Mic' && <Mic className="w-4 h-4 text-emerald-600" />}
                                    {cat.iconName === 'Cable' && <Cable className="w-4 h-4 text-slate-600" />}
                                    {cat.iconName !== 'Music' && cat.iconName !== 'Church' && cat.iconName !== 'Volume2' && cat.iconName !== 'Mic' && cat.iconName !== 'Cable' && (
                                      <Speaker className="w-4 h-4 text-orange-600" />
                                    )}
                                  </div>
                                  <div>
                                    <span className="font-bold text-slate-900 block text-xs">
                                      {cat.name}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                      ID: {cat.id}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="p-3.5">
                                <code className="bg-slate-100 text-slate-800 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-200">
                                  {cat.slug}
                                </code>
                              </td>

                              <td className="p-3.5 max-w-xs">
                                <span className="text-slate-600 text-[11px] line-clamp-2" title={cat.description}>
                                  {cat.description || 'Sem descrição cadastrada'}
                                </span>
                              </td>

                              <td className="p-3.5 max-w-xs">
                                <div className="flex flex-wrap gap-1">
                                  {cat.subcategories && cat.subcategories.length > 0 ? (
                                    cat.subcategories.slice(0, 3).map((sub, idx) => (
                                      <span
                                        key={idx}
                                        className="inline-block bg-slate-100 text-slate-700 text-[10px] px-1.5 py-0.5 rounded border border-slate-200"
                                      >
                                        {sub}
                                      </span>
                                    ))
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">Nenhuma</span>
                                  )}
                                  {cat.subcategories && cat.subcategories.length > 3 && (
                                    <span className="text-[10px] text-slate-500 font-semibold">
                                      +{cat.subcategories.length - 3}
                                    </span>
                                  )}
                                </div>
                              </td>

                              <td className="p-3.5 text-center">
                                <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                                  {productCount} un.
                                </span>
                              </td>

                              <td className="p-3.5 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditCategory(cat)}
                                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                                    title="Editar categoria"
                                  >
                                    <Edit className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setCategoryToDelete(cat)}
                                    className="p-1.5 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors"
                                    title="Excluir categoria"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Product Edit/Create Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl p-6 space-y-4 my-8 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-950 font-heading">
                {editingProduct?.id ? 'Editar Produto' : 'Cadastrar Produto'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={editingProduct?.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Marca *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct?.brand || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Categoria *</label>
                  <select
                    value={editingProduct?.category || (categories[0]?.name || 'Áudio Profissional')}
                    onChange={(e) => {
                      const val = e.target.value;
                      const matched = categories.find((c) => c.name === val);
                      setEditingProduct({
                        ...editingProduct,
                        category: val,
                        categorySlug: matched?.slug || 'audio-profissional',
                      });
                    }}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Preço Normal (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Estoque (un.) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct?.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              {/* Upload */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-slate-700 font-semibold">Foto do Produto (Vercel Blob)</label>
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-medium rounded-lg border border-slate-300 transition-colors flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{isUploadingImage ? 'Enviando...' : 'Fazer Upload'}</span>
                    <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" disabled={isUploadingImage} />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-3.5 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-6 space-y-3 shadow-xl text-xs">
            <h3 className="text-base font-bold text-slate-950 font-heading">Novo Cupom</h3>
            <form onSubmit={handleSaveCouponSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Código *</label>
                <input
                  type="text"
                  required
                  placeholder="EX: PROMO10"
                  value={editingCoupon?.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Tipo</label>
                  <select
                    value={editingCoupon?.discountType || 'percentage'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as any })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300"
                  >
                    <option value="percentage">% Desconto</option>
                    <option value="fixed">R$ Fixo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Valor</label>
                  <input
                    type="number"
                    required
                    value={editingCoupon?.value || 10}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, value: Number(e.target.value) })}
                    className="w-full bg-slate-50 text-slate-900 p-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCouponModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Create/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl p-6 space-y-4 my-8 shadow-xl text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center border border-orange-200">
                  <Layers className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-slate-950 font-heading">
                  {editingCategory?.id ? 'Editar Categoria' : 'Cadastrar Nova Categoria'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySubmit} className="space-y-4">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome da Categoria *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Mesas de Som Digitais"
                  value={editingCategory?.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name
                      .toLowerCase()
                      .normalize('NFD')
                      .replace(/[\u0300-\u036f]/g, '')
                      .replace(/[^a-z0-9]+/g, '-')
                      .replace(/(^-|-$)+/g, '');
                    setEditingCategory({
                      ...editingCategory,
                      name,
                      slug: editingCategory?.id ? (editingCategory.slug || autoSlug) : autoSlug,
                    });
                  }}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Slug / Identificador URL *</label>
                <input
                  type="text"
                  required
                  placeholder="ex: mesas-de-som-digitais"
                  value={editingCategory?.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:outline-none font-mono text-[11px]"
                />
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Usado na URL da loja: <code className="text-slate-600">wisbeck.com.br/categoria/{editingCategory?.slug || 'nome'}</code>
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Ícone Representativo</label>
                <div className="grid grid-cols-6 gap-2">
                  {[
                    { id: 'Speaker', label: 'Áudio', icon: Speaker },
                    { id: 'Music', label: 'Música', icon: Music },
                    { id: 'Church', label: 'Igrejas', icon: Church },
                    { id: 'Volume2', label: 'Ambiente', icon: Volume2 },
                    { id: 'Mic', label: 'Microfone', icon: Mic },
                    { id: 'Cable', label: 'Cabos', icon: Cable },
                  ].map((item) => {
                    const IconComponent = item.icon;
                    const isSelected = (editingCategory?.iconName || 'Speaker') === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setEditingCategory({ ...editingCategory, iconName: item.id })}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center transition-all ${
                          isSelected
                            ? 'border-orange-500 bg-orange-50 text-orange-800 font-bold shadow-xs'
                            : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mb-1" />
                        <span className="text-[9px] truncate max-w-full">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Descrição do Departamento</label>
                <textarea
                  rows={2}
                  placeholder="Breve resumo exibido no catálogo e nos banners da categoria..."
                  value={editingCategory?.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">
                  Subcategorias (separadas por vírgula)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Caixas Ativas, Mesas Analógicas, Subwoofers"
                  value={subcategoriesInput}
                  onChange={(e) => setSubcategoriesInput(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:outline-none"
                />
                {subcategoriesInput && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {subcategoriesInput
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                      .map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-xs"
                >
                  {editingCategory?.id ? 'Salvar Categoria' : 'Cadastrar Categoria'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-xl text-xs">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-200">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-950 font-heading">
                Excluir Categoria
              </h3>
              <p className="text-slate-600 mt-1">
                Deseja realmente remover a categoria <strong className="text-slate-950 font-semibold">"{categoryToDelete.name}"</strong>?
              </p>
              {getCategoryProductCount(categoryToDelete.slug, categoryToDelete.name) > 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-[11px] space-y-1">
                  <span className="font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Produtos vinculados: {getCategoryProductCount(categoryToDelete.slug, categoryToDelete.name)} un.
                  </span>
                  <p>Os produtos continuarão no estoque, mas não estarão mais associados a esta categoria.</p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteCategory}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg shadow-xs"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
