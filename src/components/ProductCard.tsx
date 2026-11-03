import React, { useState } from 'react';
import { ShoppingCart, Heart, Star, Check, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../lib/store';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, toggleWishlist, wishlist, navigateToProduct } = useStore();
  const [addedRecently, setAddedRecently] = useState(false);

  const isFavorited = wishlist.includes(product.id);
  const pixPrice = product.price * (1 - product.pixDiscountPercent / 100);
  const installment12x = (product.price / 12).toFixed(2).replace('.', ',');

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedRecently(true);
    setTimeout(() => setAddedRecently(false), 1600);
  };

  return (
    <div 
      onClick={() => navigateToProduct(product.id)}
      className="group modern-card rounded-2xl overflow-hidden flex flex-col justify-between cursor-pointer relative bg-white"
    >
      {/* Top Media Area */}
      <div className="relative overflow-hidden bg-slate-50/80 p-5 aspect-square flex items-center justify-center">
        
        {/* Discrete Editorial Badge Overlay */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
          {product.isBestSeller && (
            <span className="bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Mais Vendido
            </span>
          )}
          {product.isChurchSpecial && (
            <span className="bg-orange-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs uppercase tracking-wider">
              Para Igrejas
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isFavorited
              ? 'bg-rose-500 text-white shadow-md'
              : 'bg-white/90 backdrop-blur-xs text-slate-400 hover:text-slate-900 hover:bg-white shadow-xs border border-slate-200/80'
          }`}
          title="Salvar nos favoritos"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Product Image with smooth hover scale */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-contain object-center group-hover:scale-108 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Quick View Tag on Image Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-slate-900/60 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="text-[11px] font-semibold text-white flex items-center gap-1.5 drop-shadow-sm">
            <span>Ver detalhes</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3.5">
        <div className="space-y-1.5">
          {/* Metadata: Brand + Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 uppercase tracking-wider">
              {product.brand}
            </span>
            <div className="flex items-center text-amber-500 font-medium">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
              <span className="text-slate-700 font-semibold">{product.rating.toFixed(1)}</span>
              <span className="text-slate-400 ml-1">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Title */}
          <h3
            className="text-xs sm:text-sm font-semibold text-slate-900 line-clamp-2 group-hover:text-orange-600 transition-colors leading-snug"
            title={product.name}
          >
            {product.name}
          </h3>
        </div>

        {/* Price & Cart Action */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          {product.originalPrice && (
            <p className="text-[11px] text-slate-400 line-through">
              R$ {product.originalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          )}

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg sm:text-xl font-extrabold text-slate-950 font-heading">
                R$ {pixPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                10% OFF no PIX
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              ou R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} em 12x de R$ {installment12x} sem juros
            </p>
          </div>

          {/* Modern Tactile Button */}
          <div className="pt-1.5">
            <button
              type="button"
              onClick={handleAddToCartClick}
              className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200 ${
                addedRecently
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs hover:shadow-md hover:shadow-slate-900/10 active:scale-[0.98]'
              }`}
            >
              {addedRecently ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Adicionado à Sacola!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 text-orange-400" />
                  <span>Comprar Agora</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
