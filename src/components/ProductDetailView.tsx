import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Star, 
  Truck, 
  ShieldCheck, 
  CreditCard, 
  MessageCircle, 
  Check, 
  MapPin, 
  Loader2, 
  Box, 
  Zap,
  Church
} from 'lucide-react';
import { Product, FreightOption } from '../types';
import { useStore } from '../lib/store';
import { fetchAddressByCep, calculateCorreiosFreight, formatCep, cleanCep } from '../lib/correios';

interface ProductDetailViewProps {
  productId: string;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({ productId }) => {
  const {
    products,
    settings,
    addToCart,
    toggleWishlist,
    wishlist,
    navigateToHome,
    navigateToCategory,
    navigateToProduct,
    setCurrentView,
    setIsCartOpen,
  } = useStore();

  const product = products.find((p) => p.id === productId) || products[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'specs' | 'desc' | 'included'>('specs');

  // Freight calculation state
  const [cepInput, setCepInput] = useState('');
  const [isCalculatingFreight, setIsCalculatingFreight] = useState(false);
  const [calculatedFreight, setCalculatedFreight] = useState<FreightOption[] | null>(null);
  const [freightAddressInfo, setFreightAddressInfo] = useState<string | null>(null);
  const [freightError, setFreightError] = useState<string | null>(null);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <p className="text-slate-500">Produto não encontrado.</p>
        <button
          onClick={navigateToHome}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-semibold"
        >
          Voltar para a Loja
        </button>
      </div>
    );
  }

  const isFavorited = wishlist.includes(product.id);
  const pixPrice = product.price * (1 - product.pixDiscountPercent / 100);
  const installment12x = (product.price / 12).toFixed(2).replace('.', ',');

  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.categorySlug === product.categorySlug || p.brand === product.brand))
    .slice(0, 4);

  const handleCepSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = cleanCep(cepInput);
    if (raw.length !== 8) {
      setFreightError('Digite um CEP válido com 8 dígitos.');
      return;
    }

    setFreightError(null);
    setIsCalculatingFreight(true);

    try {
      const address = await fetchAddressByCep(raw);
      if (!address || !address.state) {
        setFreightError('CEP não encontrado na base dos Correios.');
        setIsCalculatingFreight(false);
        return;
      }

      setFreightAddressInfo(`${address.street ? `${address.street}, ` : ''}${address.neighborhood ? `${address.neighborhood} - ` : ''}${address.city}/${address.state}`);

      const options = calculateCorreiosFreight(
        address.state,
        product.weightKg,
        product.price * quantity,
        settings.freeShippingThreshold
      );

      setCalculatedFreight(options);
    } catch (err) {
      setFreightError('Erro ao consultar Correios. Tente novamente.');
    } finally {
      setIsCalculatingFreight(false);
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  const handleWhatsAppConsultant = () => {
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(
      `Olá Wisbeck! Gostaria de tirar dúvidas sobre o produto "${product.name}" (código: ${product.id}).`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
          <button onClick={navigateToHome} className="hover:text-slate-900 transition-colors">
            Início
          </button>
          <span>/</span>
          <button
            onClick={() => navigateToCategory(product.categorySlug)}
            className="hover:text-slate-900 transition-colors"
          >
            {product.category}
          </button>
          {product.subcategory && (
            <>
              <span>/</span>
              <button
                onClick={() => navigateToCategory(product.categorySlug, product.subcategory)}
                className="hover:text-slate-900 transition-colors"
              >
                {product.subcategory}
              </button>
            </>
          )}
          {product.subItem && (
            <>
              <span>/</span>
              <button
                onClick={() => navigateToCategory(product.categorySlug, product.subcategory, product.subItem)}
                className="hover:text-slate-900 transition-colors font-medium text-orange-600"
              >
                {product.subItem}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
        </div>

        {/* Product Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
          
          {/* Gallery Left (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-square w-full bg-slate-50 rounded-xl p-8 flex items-center justify-center border border-slate-200/80 overflow-hidden">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                  isFavorited ? 'bg-rose-500 text-white' : 'bg-white text-slate-400 hover:text-slate-700 shadow-xs border border-slate-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-18 h-18 rounded-lg bg-slate-50 p-1.5 border-2 shrink-0 transition-all ${
                      selectedImageIndex === idx ? 'border-orange-600' : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}

            {/* Quick Guarantees */}
            <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Garantia oficial com Nota Fiscal eletrônica</span>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200/80">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Enviado de Itajaí/SC ou retirada presencial</span>
              </div>
            </div>
          </div>

          {/* Pricing & Purchase Right (6 cols) */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              
              {/* Brand and Tag */}
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  {product.brand}
                </span>
                {product.isChurchSpecial && (
                  <span className="text-xs font-semibold text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-0.5 rounded flex items-center gap-1.5">
                    <Church className="w-3.5 h-3.5 text-orange-600" />
                    Ideal para Igrejas
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 leading-tight font-heading">
                {product.name}
              </h1>

              {/* Rating and Availability */}
              <div className="flex items-center gap-3 text-xs text-slate-500">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-500 mr-1" />
                  <span className="font-bold text-slate-900">{product.rating.toFixed(1)}</span>
                </div>
                <span>•</span>
                <span>{product.reviewsCount} avaliações</span>
                <span>•</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Em estoque ({product.stock} unidades)
                </span>
              </div>

              {/* Price Container */}
              <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                {product.originalPrice && (
                  <p className="text-xs text-slate-400 line-through">
                    De R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                )}

                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-heading">
                    R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                  <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    10% OFF NO PIX
                  </span>
                </div>

                <p className="text-xs text-slate-600">
                  ou <strong className="text-slate-900">R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> em até 12x de R$ {installment12x} sem juros
                </p>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-3.5 pt-2">
                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200/90 p-1 shadow-xs">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white rounded-lg font-bold transition-all active:scale-95"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-bold text-xs font-mono">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-9 h-9 flex items-center justify-center text-slate-600 hover:text-slate-950 hover:bg-white rounded-lg font-bold transition-all active:scale-95"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      addToCart(product, quantity);
                      setIsCartOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-900 font-bold text-xs sm:text-sm border border-slate-300/80 transition-all active:scale-[0.98] shadow-xs"
                  >
                    <ShoppingCart className="w-4 h-4 text-orange-600" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                </div>

                {/* Buy Now Primary CTA */}
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full btn-primary-gradient flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold text-sm sm:text-base tracking-wide"
                >
                  <Zap className="w-5 h-5 fill-white" />
                  <span>COMPRAR AGORA • CHECKOUT SEGURO</span>
                </button>

                {/* WhatsApp specialist consultation */}
                <button
                  type="button"
                  onClick={handleWhatsAppConsultant}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 text-emerald-900 border border-emerald-200 text-xs font-semibold transition-all shadow-xs active:scale-[0.98]"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" />
                  <span>Dúvidas Técnicas? Fale com nosso consultor via WhatsApp</span>
                </button>
              </div>

              {/* Correios Freight Calculator */}
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <Truck className="w-4 h-4 text-orange-600" />
                  <span>Cálculo de Frete Correios (PAC / SEDEX)</span>
                </div>

                <form onSubmit={handleCepSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite seu CEP (ex: 88307-100)"
                    value={cepInput}
                    onChange={(e) => setCepInput(formatCep(e.target.value))}
                    maxLength={9}
                    className="flex-1 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl px-3.5 py-2.5 border border-slate-300 focus:bg-white focus:outline-none focus:border-orange-500 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isCalculatingFreight}
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95 shadow-xs"
                  >
                    {isCalculatingFreight ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Calcular'}
                  </button>
                </form>

                {freightError && <p className="text-xs text-rose-600">{freightError}</p>}

                {freightAddressInfo && (
                  <p className="text-[11px] text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Destino: <strong>{freightAddressInfo}</strong></span>
                  </p>
                )}

                {/* Freight options cards */}
                {calculatedFreight && (
                  <div className="space-y-2 pt-1">
                    {calculatedFreight.map((opt) => (
                      <div
                        key={opt.code}
                        className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">{opt.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Prazo: {opt.deadlineDays === 0 ? 'Imediato' : `${opt.deadlineDays} a ${opt.deadlineDays + 2} dias úteis`}
                          </p>
                        </div>
                        <span className={`font-bold text-sm ${opt.price === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                          {opt.price === 0 ? 'GRÁTIS' : `R$ ${opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </div>

        </div>

        {/* Specifications and Details Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
            <button
              onClick={() => setActiveTab('specs')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'specs'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Especificações Técnicas
            </button>
            <button
              onClick={() => setActiveTab('desc')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'desc'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Descrição Completa
            </button>
            <button
              onClick={() => setActiveTab('included')}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors ${
                activeTab === 'included'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Itens Inclusos
            </button>
          </div>

          <div className="pt-2 text-sm text-slate-700">
            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(product.technicalSpecs).map(([key, val]) => (
                  <div key={key} className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <span className="text-slate-500 font-medium">{key}</span>
                    <span className="text-slate-900 font-semibold text-right max-w-[60%]">{val}</span>
                  </div>
                ))}
                <div className="flex justify-between p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                  <span className="text-slate-500 font-medium">Peso c/ Embalagem</span>
                  <span className="text-slate-900 font-semibold">{product.weightKg} kg</span>
                </div>
              </div>
            )}

            {activeTab === 'desc' && (
              <div className="text-slate-700 leading-relaxed text-xs sm:text-sm space-y-4">
                <p>{product.description}</p>
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-200 text-orange-900 text-xs">
                  <strong>Nota do Especialista Wisbeck:</strong> Equipamento testado e aprovado em nosso laboratório de áudio em Itajaí/SC. Alta durabilidade, fidelidade de frequência e suporte técnico nacional.
                </div>
              </div>
            )}

            {activeTab === 'included' && (
              <div className="space-y-2">
                {product.whatsIncluded && product.whatsIncluded.length > 0 ? (
                  product.whatsIncluded.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                      <Box className="w-4 h-4 text-orange-600 shrink-0" />
                      <span className="text-slate-800">{item}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500">Embalagem original de fábrica com todos os acessórios padrão.</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-950 font-heading">
              Produtos Relacionados
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedProducts.map((rel) => {
                const relPix = rel.price * (1 - rel.pixDiscountPercent / 100);
                return (
                  <div
                    key={rel.id}
                    onClick={() => navigateToProduct(rel.id)}
                    className="bg-white p-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between"
                  >
                    <div className="aspect-square bg-slate-50 rounded-lg p-3 flex items-center justify-center overflow-hidden mb-2">
                      <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">{rel.brand}</p>
                      <p className="text-xs font-semibold text-slate-800 line-clamp-2 leading-tight">{rel.name}</p>
                      <p className="text-sm font-bold text-slate-950 pt-1">
                        R$ {relPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
