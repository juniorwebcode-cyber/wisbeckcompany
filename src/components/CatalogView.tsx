import React, { useState, useMemo } from 'react';
import { ArrowUpDown, X, Church } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../lib/store';

export const CatalogView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    selectedCategory,
    selectedBrand,
    searchQuery,
    setSelectedCategory,
    setSelectedBrand,
    setSearchQuery,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterChurchOnly, setFilterChurchOnly] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter((p) => p.categorySlug === selectedCategory);
    }

    if (selectedBrand) {
      result = result.filter((p) => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    if (filterChurchOnly) {
      result = result.filter((p) => p.isChurchSpecial);
    }

    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategory, selectedBrand, filterChurchOnly, sortBy]);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Title and Active Filter Info */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-heading">
                {activeCategoryObj ? activeCategoryObj.name : selectedBrand ? `Marca: ${selectedBrand}` : 'Catálogo de Produtos'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {filteredProducts.length} itens encontrados com garantia oficial e entrega Correios
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5" /> Ordenar:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white text-xs text-slate-900 p-2 rounded-lg border border-slate-300 focus:outline-none focus:border-slate-900 shadow-xs"
              >
                <option value="featured">Destaques & Mais Vendidos</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory || selectedBrand || searchQuery || filterChurchOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="font-medium text-slate-400">Filtros:</span>
              
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800">
                  {activeCategoryObj?.name}
                  <button onClick={() => setSelectedCategory(null)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800">
                  {selectedBrand}
                  <button onClick={() => setSelectedBrand(null)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-800">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterChurchOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-orange-50 border border-orange-200 text-orange-800 font-semibold">
                  Especial Igrejas
                  <button onClick={() => setFilterChurchOnly(false)} className="hover:text-rose-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedBrand(null);
                  setSearchQuery('');
                  setFilterChurchOnly(false);
                }}
                className="text-xs text-orange-600 hover:underline font-semibold ml-2"
              >
                Limpar todos
              </button>
            </div>
          )}
        </div>

        {/* Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Filters */}
          <div className="space-y-4">
            <button
              onClick={() => setFilterChurchOnly(!filterChurchOnly)}
              className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-colors ${
                filterChurchOnly
                  ? 'bg-orange-600 border-orange-600 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Church className="w-4 h-4" />
                <span>Linha Especial para Igrejas</span>
              </div>
              <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-bold">
                TOP
              </span>
            </button>

            {/* Categories */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                Categorias
              </h3>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                    selectedCategory === null
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  Todas as Categorias
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg transition-colors ${
                      selectedCategory === cat.slug
                        ? 'bg-slate-900 text-white font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Brands */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                Marcas
              </h3>
              <div className="flex flex-wrap gap-1 text-xs">
                {brands.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBrand(selectedBrand === b.name ? null : b.name)}
                    className={`px-2.5 py-1 rounded-md border text-[11px] transition-colors ${
                      selectedBrand === b.name
                        ? 'bg-slate-900 text-white border-slate-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Products */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-16 text-center bg-white rounded-xl border border-slate-200 text-slate-600 space-y-3">
                <p className="text-sm font-semibold text-slate-900">Nenhum produto encontrado com estes filtros.</p>
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedBrand(null);
                    setSearchQuery('');
                    setFilterChurchOnly(false);
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold"
                >
                  Limpar Filtros e Ver Catálogo
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
