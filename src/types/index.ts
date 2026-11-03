export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  pixDiscountPercent: number; // e.g. 10
  stock: number;
  images: string[];
  description: string;
  shortDescription?: string;
  technicalSpecs: Record<string, string>;
  whatsIncluded?: string[];
  featured?: boolean;
  isBestSeller?: boolean;
  isNewRelease?: boolean;
  isChurchSpecial?: boolean;
  rating: number;
  reviewsCount: number;
  weightKg: number;
  dimensionsCm: {
    height: number;
    width: number;
    depth: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  subcategories: string[];
}

export interface Brand {
  id: string;
  name: string;
  logoUrl?: string;
  tagline?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FreightOption {
  code: 'PAC' | 'SEDEX' | 'RETIRADA';
  name: string;
  price: number;
  deadlineDays: number;
  carrier: string;
  description: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  cpf: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  code: string; // e.g. #WB-7824
  createdAt: string;
  customer: CustomerInfo;
  address: Address;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  freightOption: FreightOption;
  freightPrice: number;
  total: number;
  paymentMethod: 'PIX' | 'CREDIT_CARD' | 'BOLETO';
  installments?: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingCode?: string;
  notes?: string;
  whatsappMessageText: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number; // 10% or R$ 50
  minOrderValue: number;
  validUntil: string;
  usageLimit: number;
  timesUsed: number;
  active: boolean;
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  address: string;
  cityStateZip: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  instagram: string;
  facebook: string;
  youtube: string;
  topAnnouncement: string;
  freeShippingThreshold: number;
  pixDiscountPercent: number;
}
