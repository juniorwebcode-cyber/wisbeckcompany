import { useSyncExternalStore } from 'react';
import { Product, Category, Brand, CartItem, Order, Coupon, StoreSettings } from '../types';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_BRANDS, INITIAL_COUPONS, INITIAL_ORDERS, INITIAL_SETTINGS } from './mockData';
import { syncOrderToFirebase, syncProductToFirebase, updateOrderStatusInFirebase } from './firebase';

const STORAGE_KEY_PRODUCTS = 'wisbeck_products_v2';
const STORAGE_KEY_CATEGORIES = 'wisbeck_categories_v2';
const STORAGE_KEY_CART = 'wisbeck_cart_v1';
const STORAGE_KEY_ORDERS = 'wisbeck_orders_v1';
const STORAGE_KEY_COUPONS = 'wisbeck_coupons_v1';
const STORAGE_KEY_SETTINGS = 'wisbeck_settings_v2';
const STORAGE_KEY_ADMIN_AUTH = 'wisbeck_admin_auth_v1';
const STORAGE_KEY_WISHLIST = 'wisbeck_wishlist_v1';

export type ViewType = 
  | 'home' 
  | 'catalog' 
  | 'product' 
  | 'checkout' 
  | 'church-solutions' 
  | 'about' 
  | 'contact' 
  | 'orders-tracker' 
  | 'admin'
  | 'obrigado';

export interface StoreState {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  settings: StoreSettings;
  isAdminLoggedIn: boolean;
  currentView: ViewType;
  selectedProductId: string | null;
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedSubItem: string | null;
  selectedBrand: string | null;
  searchQuery: string;
  isCartOpen: boolean;
  activeCoupon: Coupon | null;
  toastMessage: { text: string; type: 'success' | 'info' | 'error' } | null;
}

// Initial state getters with LocalStorage fallback
export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_PRODUCTS;
}

export function getStoredCategories(): Category[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_CATEGORIES;
}

export function getStoredOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ORDERS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_ORDERS;
}

export function getStoredCoupons(): Coupon[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_COUPONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return INITIAL_COUPONS;
}

export function getStoredSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS) || localStorage.getItem('wisbeck_settings_v1');
    if (raw) {
      const parsed: StoreSettings = JSON.parse(raw);
      if (parsed.whatsapp && parsed.whatsapp.includes('99284')) {
        parsed.whatsapp = '(47) 99628-8524';
        localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(parsed));
      }
      return parsed;
    }
  } catch (e) {
    console.error(e);
  }
  return INITIAL_SETTINGS;
}

export function getStoredCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CART);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function getStoredWishlist(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_WISHLIST);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(e);
  }
  return [];
}

export function getStoredAdminAuth(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY_ADMIN_AUTH) === 'true';
  } catch {
    return false;
  }
}

// Singleton state instance shared across all components
let state: StoreState = {
  products: getStoredProducts(),
  categories: getStoredCategories(),
  brands: INITIAL_BRANDS,
  cart: getStoredCart(),
  wishlist: getStoredWishlist(),
  orders: getStoredOrders(),
  coupons: getStoredCoupons(),
  settings: getStoredSettings(),
  isAdminLoggedIn: getStoredAdminAuth(),
  currentView: 'home',
  selectedProductId: null,
  selectedCategory: null,
  selectedSubcategory: null,
  selectedSubItem: null,
  selectedBrand: null,
  searchQuery: '',
  isCartOpen: false,
  activeCoupon: null,
  toastMessage: null,
};

const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

function updateState(partial: Partial<StoreState>) {
  let hasChange = false;
  for (const k in partial) {
    const key = k as keyof StoreState;
    if (state[key] !== partial[key]) {
      hasChange = true;
      break;
    }
  }
  if (!hasChange) return;

  state = { ...state, ...partial };
  notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot() {
  return state;
}

// Stable action methods defined once at module level
export function showToast(text: string, type: 'success' | 'info' | 'error' = 'success') {
  updateState({ toastMessage: { text, type } });
  setTimeout(() => {
    if (state.toastMessage?.text === text) {
      updateState({ toastMessage: null });
    }
  }, 4000);
}

export function setCurrentView(view: ViewType) {
  updateState({ currentView: view });
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function setSelectedProductId(id: string | null) {
  updateState({ selectedProductId: id });
}

export function setSelectedCategory(cat: string | null) {
  updateState({ 
    selectedCategory: cat,
    selectedSubcategory: null,
    selectedSubItem: null,
  });
}

export function setSelectedSubcategory(sub: string | null) {
  updateState({ 
    selectedSubcategory: sub,
    selectedSubItem: null,
    currentView: 'catalog',
  });
}

export function setSelectedSubItem(item: string | null) {
  updateState({ 
    selectedSubItem: item,
    currentView: 'catalog',
  });
}

export function setSelectedBrand(brand: string | null) {
  updateState({ selectedBrand: brand });
}

export function setSearchQuery(query: string) {
  updateState({ searchQuery: query });
}

export function setIsCartOpen(open: boolean) {
  updateState({ isCartOpen: open });
}

export function addToCart(product: Product, quantity: number = 1) {
  const current = state.cart;
  const existingIndex = current.findIndex((item) => item.product.id === product.id);
  let updated: CartItem[];

  if (existingIndex > -1) {
    updated = current.map((item, idx) =>
      idx === existingIndex
        ? { ...item, quantity: Math.min(product.stock, item.quantity + quantity) }
        : item
    );
  } else {
    updated = [...current, { product, quantity: Math.min(product.stock, quantity) }];
  }

  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(updated));
  updateState({ cart: updated, isCartOpen: true });
  showToast(`"${product.name.slice(0, 30)}..." adicionado ao carrinho!`, 'success');
}

export function updateCartQuantity(productId: string, quantity: number) {
  const current = state.cart;
  if (quantity <= 0) {
    removeFromCart(productId);
    return;
  }
  const updated = current.map((item) =>
    item.product.id === productId ? { ...item, quantity } : item
  );
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(updated));
  updateState({ cart: updated });
}

export function removeFromCart(productId: string) {
  const current = state.cart;
  const updated = current.filter((item) => item.product.id !== productId);
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(updated));
  updateState({ cart: updated });
  showToast('Item removido do carrinho.', 'info');
}

export function clearCart() {
  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify([]));
  updateState({ cart: [] });
}

export function toggleWishlist(productId: string) {
  const current = state.wishlist;
  const exists = current.includes(productId);
  const updated = exists ? current.filter((id) => id !== productId) : [...current, productId];
  localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(updated));
  updateState({ wishlist: updated });
  showToast(exists ? 'Removido dos favoritos' : 'Adicionado aos favoritos!', 'info');
}

export function applyCoupon(code: string): { success: boolean; message: string } {
  const cleanCode = code.trim().toUpperCase();
  const found = state.coupons.find((c) => c.code === cleanCode && c.active);

  if (!found) {
    return { success: false, message: 'Cupom inválido ou expirado.' };
  }

  const subtotal = state.cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  if (found.minOrderValue && subtotal < found.minOrderValue) {
    return {
      success: false,
      message: `Cupom requer valor mínimo de R$ ${found.minOrderValue.toFixed(2)} em produtos.`,
    };
  }

  updateState({ activeCoupon: found });
  showToast(`Cupom ${found.code} aplicado com sucesso!`, 'success');
  return { success: true, message: 'Cupom aplicado!' };
}

export function removeCoupon() {
  updateState({ activeCoupon: null });
  showToast('Cupom removido.', 'info');
}

export async function createOrder(orderData: Omit<Order, 'id' | 'code' | 'createdAt' | 'status' | 'whatsappMessageText'>) {
  const id = `wb-${Date.now()}`;
  const code = `#WB-${Math.floor(1000 + Math.random() * 9000)}`;
  const createdAt = new Date().toISOString();

  const itemsList = orderData.items
    .map((i) => `• ${i.quantity}x ${i.name} (R$ ${(i.price * i.quantity).toFixed(2)})`)
    .join('\n');

  const whatsappMessageText = `*NOVO PEDIDO WISBECK - ${code}*
------------------------------
*Cliente:* ${orderData.customer.name}
*WhatsApp:* ${orderData.customer.phone}
*E-mail:* ${orderData.customer.email}

*Endereço de Entrega:*
${orderData.address.street}, ${orderData.address.number} ${orderData.address.complement || ''}
${orderData.address.neighborhood} - ${orderData.address.city}/${orderData.address.state}
CEP: ${orderData.address.cep}

*Itens Solicitados:*
${itemsList}

*Subtotal:* R$ ${orderData.subtotal.toFixed(2)}
*Frete (${orderData.freightOption?.name || 'Correios'}):* R$ ${orderData.freightPrice.toFixed(2)} (Prazo: ${orderData.freightOption?.deadlineDays || 5} dias)
${orderData.discount > 0 ? `*Desconto:* -R$ ${orderData.discount.toFixed(2)}\n` : ''}*TOTAL FINAL:* R$ ${orderData.total.toFixed(2)}
*Forma de Pagamento:* ${orderData.paymentMethod}
------------------------------
Aguardando confirmação do operador Wisbeck.`;

  const newOrder: Order = {
    ...orderData,
    id,
    code,
    createdAt,
    status: 'pending',
    whatsappMessageText,
  };

  const currentOrders = state.orders;
  const updatedOrders = [newOrder, ...currentOrders];
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updatedOrders));

  let updatedCoupons = state.coupons;
  if (state.activeCoupon) {
    updatedCoupons = state.coupons.map((c) =>
      c.id === state.activeCoupon?.id ? { ...c, timesUsed: c.timesUsed + 1 } : c
    );
    localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(updatedCoupons));
  }

  localStorage.setItem(STORAGE_KEY_CART, JSON.stringify([]));

  updateState({
    orders: updatedOrders,
    coupons: updatedCoupons,
    activeCoupon: null,
    cart: [],
  });

  await syncOrderToFirebase(newOrder);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: Order['status'], trackingCode?: string) {
  const current = state.orders;
  const updated = current.map((ord) =>
    ord.id === orderId ? { ...ord, status, ...(trackingCode ? { trackingCode } : {}) } : ord
  );
  localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(updated));
  updateState({ orders: updated });
  await updateOrderStatusInFirebase(orderId, status, trackingCode);
  showToast(`Status do pedido atualizado para: ${status}`, 'success');
}

export async function saveProduct(product: Product) {
  const current = state.products;
  const existingIndex = current.findIndex((p) => p.id === product.id);
  let updated: Product[];

  if (existingIndex > -1) {
    updated = current.map((p) => (p.id === product.id ? product : p));
    showToast('Produto atualizado com sucesso!', 'success');
  } else {
    updated = [product, ...current];
    showToast('Novo produto cadastrado com sucesso!', 'success');
  }

  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  updateState({ products: updated });
  await syncProductToFirebase(product);
}

export function deleteProduct(productId: string) {
  const current = state.products;
  const updated = current.filter((p) => p.id !== productId);
  localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(updated));
  updateState({ products: updated });
  showToast('Produto removido do catálogo.', 'info');
}

export function saveCoupon(coupon: Coupon) {
  const current = state.coupons;
  const existingIndex = current.findIndex((c) => c.id === coupon.id);
  let updated: Coupon[];

  if (existingIndex > -1) {
    updated = current.map((c) => (c.id === coupon.id ? coupon : c));
    showToast('Cupom atualizado!', 'success');
  } else {
    updated = [coupon, ...current];
    showToast('Novo cupom criado!', 'success');
  }

  localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(updated));
  updateState({ coupons: updated });
}

export function deleteCoupon(couponId: string) {
  const current = state.coupons;
  const updated = current.filter((c) => c.id !== couponId);
  localStorage.setItem(STORAGE_KEY_COUPONS, JSON.stringify(updated));
  updateState({ coupons: updated });
  showToast('Cupom removido.', 'info');
}

export function saveCategory(category: Category) {
  const current = state.categories;
  const existingIndex = current.findIndex((c) => c.id === category.id);
  let updated: Category[];

  if (existingIndex > -1) {
    updated = current.map((c) => (c.id === category.id ? category : c));
    showToast(`Categoria "${category.name}" atualizada com sucesso!`, 'success');
  } else {
    updated = [...current, category];
    showToast(`Nova categoria "${category.name}" cadastrada!`, 'success');
  }

  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
  updateState({ categories: updated });
}

export function deleteCategory(categoryId: string) {
  const current = state.categories;
  const toDelete = current.find((c) => c.id === categoryId);
  const updated = current.filter((c) => c.id !== categoryId);
  localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(updated));
  updateState({ categories: updated });
  showToast(`Categoria "${toDelete?.name || 'selecionada'}" removida com sucesso.`, 'info');
}

export function saveSettings(newSettings: StoreSettings) {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(newSettings));
  updateState({ settings: newSettings });
  showToast('Configurações da loja salvas com sucesso!', 'success');
}

export function adminLogin(email: string, pass: string): boolean {
  if (email.trim().toLowerCase() === 'admin@x.com' && pass === 'admin4321') {
    localStorage.setItem(STORAGE_KEY_ADMIN_AUTH, 'true');
    updateState({ isAdminLoggedIn: true, currentView: 'admin' });
    showToast('Login de administrador realizado!', 'success');
    return true;
  }
  showToast('Credenciais incorretas (admin@x.com / admin4321)', 'error');
  return false;
}

export function adminLogout() {
  localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  if (typeof window !== 'undefined') {
    window.location.hash = '';
  }
  updateState({ isAdminLoggedIn: false, currentView: 'home' });
  showToast('Sessão administrativa encerrada.', 'info');
}

export function navigateToProduct(productId: string) {
  updateState({
    selectedProductId: productId,
    currentView: 'product',
  });
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function navigateToCategory(slug: string, subcategory?: string, subItem?: string) {
  updateState({
    selectedCategory: slug,
    selectedSubcategory: subcategory || null,
    selectedSubItem: subItem || null,
    selectedBrand: null,
    searchQuery: '',
    currentView: 'catalog',
  });
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function navigateToBrand(brandName: string) {
  updateState({
    selectedBrand: brandName,
    selectedCategory: null,
    selectedSubcategory: null,
    selectedSubItem: null,
    searchQuery: '',
    currentView: 'catalog',
  });
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function navigateToHome() {
  updateState({
    selectedProductId: null,
    selectedCategory: null,
    selectedSubcategory: null,
    selectedSubItem: null,
    selectedBrand: null,
    searchQuery: '',
    currentView: 'home',
  });
  if (typeof window !== 'undefined') {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

export function openAdminLogin() {
  localStorage.removeItem(STORAGE_KEY_ADMIN_AUTH);
  if (typeof window !== 'undefined') {
    window.location.hash = 'admin';
  }
  updateState({
    isAdminLoggedIn: false,
    currentView: 'admin',
    selectedProductId: null,
    selectedCategory: null,
    selectedSubcategory: null,
    selectedSubItem: null,
  });
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Global actions bundle
const actions = {
  setCurrentView,
  setSelectedProductId,
  setSelectedCategory,
  setSelectedSubcategory,
  setSelectedSubItem,
  setSelectedBrand,
  setSearchQuery,
  setIsCartOpen,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  toggleWishlist,
  applyCoupon,
  removeCoupon,
  createOrder,
  updateOrderStatus,
  saveProduct,
  deleteProduct,
  saveCoupon,
  deleteCoupon,
  saveCategory,
  deleteCategory,
  saveSettings,
  adminLogin,
  adminLogout,
  openAdminLogin,
  showToast,
  navigateToProduct,
  navigateToCategory,
  navigateToBrand,
  navigateToHome,
};

// Custom React hook providing full store capabilities with stable functions
export function useStore() {
  const currentState = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return {
    ...currentState,
    ...actions,
  };
}
