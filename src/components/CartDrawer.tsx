import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Truck, 
  Tag, 
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../lib/store';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    settings,
    activeCoupon,
    applyCoupon,
    removeCoupon,
    setCurrentView,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let couponDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      couponDiscount = (subtotal * activeCoupon.value) / 100;
    } else {
      couponDiscount = Math.min(subtotal, activeCoupon.value);
    }
  }

  const taxableSubtotal = Math.max(0, subtotal - couponDiscount);
  const pixDiscount = (taxableSubtotal * settings.pixDiscountPercent) / 100;
  const totalPix = taxableSubtotal - pixDiscount;

  const freeShippingThreshold = settings.freeShippingThreshold || 599;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingPercentage = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError(null);
      setCouponInput('');
    }
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setCurrentView('checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 text-slate-900 flex flex-col shadow-xl">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-slate-900" />
              <h2 className="font-bold text-base text-slate-900 font-heading">
                Meu Carrinho ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Meter */}
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
            <div className="flex items-center justify-between text-xs mb-1.5 font-medium text-slate-700">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-orange-600" />
                {remainingForFreeShipping > 0 ? (
                  <span>
                    Faltam <strong className="text-orange-600">R$ {remainingForFreeShipping.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> para <strong className="text-slate-900">Frete Grátis</strong>
                  </span>
                ) : (
                  <span className="text-emerald-700 font-bold">
                    Parabéns! Você ganhou Frete Grátis!
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">{Math.round(freeShippingPercentage)}%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-600 rounded-full transition-all duration-300"
                style={{ width: `${freeShippingPercentage}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 mx-auto flex items-center justify-center text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">Seu carrinho está vazio</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Explore nossos microfones, mesas de som e instrumentos.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  Continuar Comprando
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-3 bg-white p-3 rounded-xl border border-slate-200 relative"
                >
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 object-contain rounded-lg bg-slate-50 p-1 border border-slate-200 shrink-0"
                  />

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.product.brand}</p>
                      <h4 className="text-xs font-semibold text-slate-900 line-clamp-2 leading-snug">
                        {item.product.name}
                      </h4>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center bg-slate-50 rounded border border-slate-300 p-0.5">
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                          className="w-5 h-5 flex items-center justify-center text-slate-500 hover:text-slate-900"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-bold text-slate-900">
                          R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    title="Remover produto"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Actions */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 space-y-3.5">
              
              {/* Coupon Section */}
              <div>
                {activeCoupon ? (
                  <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Cupom <strong>{activeCoupon.code}</strong> aplicado</span>
                    </div>
                    <button onClick={removeCoupon} className="text-slate-500 hover:text-rose-600 text-xs font-semibold">
                      Remover
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Cupom (ex: WISBECK10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 bg-white text-xs text-slate-900 placeholder:text-slate-400 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors"
                    >
                      Aplicar
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
              </div>

              {/* Financial Summary */}
              <div className="space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium text-slate-900">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Desconto do Cupom:</span>
                    <span>- R$ {couponDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-950 font-bold text-sm pt-1 border-t border-slate-200">
                  <span>Total no PIX (10% OFF):</span>
                  <span>R$ {totalPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="text-[11px] text-slate-500 text-right">
                  ou 12x de R$ {(taxableSubtotal / 12).toFixed(2).replace('.', ',')} sem juros no cartão
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full btn-primary-gradient flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl font-bold text-sm tracking-wide"
              >
                <span>FINALIZAR PEDIDO • CHECKOUT SEGURO</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Compra protegida com Nota Fiscal e garantia oficial</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
