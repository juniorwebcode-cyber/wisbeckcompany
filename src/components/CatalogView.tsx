import React, { useState, useMemo } from 'react';
import { ArrowUpDown, X, Church, ChevronRight, Layers, Tag } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { useStore } from '../lib/store';

export const CatalogView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    selectedCategory,
    selectedSubcategory,
    selectedSubItem,
    selectedBrand,
    searchQuery,
    setSelectedCategory,
    setSelectedSubcategory,
    setSelectedSubItem,
    setSelectedBrand,
    setSearchQuery,
    navigateToCategory,
    navigateToHome,
  } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [filterChurchOnly, setFilterChurchOnly] = useState(false);

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);
  const activeSubGroupObj = activeCategoryObj?.subGroups?.find(
    (g) => g.name === selectedSubcategory || g.slug === selectedSubcategory
  );

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          (p.subcategory && p.subcategory.toLowerCase().includes(q)) ||
          (p.subItem && p.subItem.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory) {
      result = result.filter(
        (p) => p.categorySlug === selectedCategory || (activeCategoryObj && p.category.toLowerCase() === activeCategoryObj.name.toLowerCase())
      );
    }

    if (selectedSubcategory) {
      const subLower = selectedSubcategory.toLowerCase();
      result = result.filter((p) => {
        if (p.subcategory && p.subcategory.toLowerCase() === subLower) return true;
        if (p.subcategorySlug && p.subcategorySlug.toLowerCase() === subLower) return true;
        return (
          p.name.toLowerCase().includes(subLower) ||
          p.description.toLowerCase().includes(subLower)
        );
      });
    }

    if (selectedSubItem) {
      const itemLower = selectedSubItem.toLowerCase();
      result = result.filter((p) => {
        if (p.subItem && p.subItem.toLowerCase() === itemLower) return true;
        if (p.subItemSlug && p.subItemSlug.toLowerCase() === itemLower) return true;
        // Check keywords like 'nylon' or 'aço' / 'corda'
        if (itemLower.includes('nylon') && (p.name.toLowerCase().includes('nylon') || p.description.toLowerCase().includes('nylon'))) return true;
        if (itemLower.includes('aço') && (p.name.toLowerCase().includes('aço') || p.name.toLowerCase().includes('folk') || p.description.toLowerCase().includes('aço'))) return true;
        return (
          p.name.toLowerCase().includes(itemLower) ||
          p.description.toLowerCase().includes(itemLower)
        );
      });
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
  }, [products, searchQuery, selectedCategory, selectedSubcategory, selectedSubItem, selectedBrand, filterChurchOnly, sortBy, activeCategoryObj]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Dynamic Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <button onClick={navigateToHome} className="hover:text-slate-900 transition-colors font-medium">
            Início
          </button>
          <span>/</span>
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setSelectedSubcategory(null);
              setSelectedSubItem(null);
            }} 
            className={`hover:text-slate-900 transition-colors ${!selectedCategory ? 'text-slate-900 font-semibold' : ''}`}
          >
            Catálogo
          </button>
          {selectedCategory && (
            <>
              <span>/</span>
              <button 
                onClick={() => {
                  setSelectedSubcategory(null);
                  setSelectedSubItem(null);
                }} 
                className={`hover:text-slate-900 transition-colors ${!selectedSubcategory ? 'text-slate-900 font-semibold' : ''}`}
              >
                {activeCategoryObj?.name || selectedCategory}
              </button>
            </>
          )}
          {selectedSubcategory && (
            <>
              <span>/</span>
              <button 
                onClick={() => setSelectedSubItem(null)} 
                className={`hover:text-slate-900 transition-colors ${!selectedSubItem ? 'text-orange-600 font-semibold' : ''}`}
              >
                {selectedSubcategory}
              </button>
            </>
          )}
          {selectedSubItem && (
            <>
              <span>/</span>
              <span className="text-orange-600 font-bold">{selectedSubItem}</span>
            </>
          )}
        </nav>

        {/* Title and Active Filter Info */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-heading">
                  {selectedSubItem
                    ? selectedSubItem
                    : selectedSubcategory
                    ? `${selectedSubcategory} — ${activeCategoryObj?.name}`
                    : activeCategoryObj
                    ? activeCategoryObj.name
                    : selectedBrand
                    ? `Marca: ${selectedBrand}`
                    : 'Catálogo de Produtos'}
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Mostrando <strong className="text-slate-800">{filteredProducts.length}</strong> equipamentos disponíveis com garantia oficial e entrega Correios
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <label className="text-xs text-slate-500 font-medium flex items-center gap-1 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /> Ordenar:
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white text-xs text-slate-900 p-2 rounded-xl border border-slate-300 focus:outline-none focus:border-slate-900 shadow-xs"
              >
                <option value="featured">Destaques & Mais Vendidos</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="rating">Melhor Avaliados</option>
              </select>
            </div>
          </div>

          {/* Subcategory Level 2 Tabs when Category is Selected */}
          {activeCategoryObj && (
            <div className="space-y-2.5 bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5 text-orange-600" />
                <span>Subcategorias de {activeCategoryObj.name}:</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedSubcategory(null);
                    setSelectedSubItem(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    !selectedSubcategory
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Todos em {activeCategoryObj.name}
                </button>

                {(activeCategoryObj.subGroups || activeCategoryObj.subcategories.map(s => ({ id: s, name: s, slug: s }))).map((grp: any) => {
                  const isSelected = selectedSubcategory === grp.name;
                  return (
                    <button
                      key={grp.id || grp.name}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedSubcategory(null);
                          setSelectedSubItem(null);
                        } else {
                          setSelectedSubcategory(grp.name);
                        }
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-orange-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-orange-50 text-slate-800 hover:text-orange-700 border border-slate-200/60'
                      }`}
                    >
                      <span>{grp.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Level 3 Specific Item Pills (e.g. Violão -> Violão Nylon, Violão Corda de Aço) */}
              {activeSubGroupObj && activeSubGroupObj.items && activeSubGroupObj.items.length > 0 && (
                <div className="pt-2.5 mt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-orange-700 flex items-center gap-1 mr-1">
                    <Tag className="w-3 h-3" />
                    <span>Tipos de {activeSubGroupObj.name}:</span>
                  </span>
                  
                  <button
                    onClick={() => setSelectedSubItem(null)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      !selectedSubItem
                        ? 'bg-orange-100 text-orange-900 border border-orange-300'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    Todos os {activeSubGroupObj.name}s
                  </button>

                  {activeSubGroupObj.items.map((item) => {
                    const isItemActive = selectedSubItem === item;
                    return (
                      <button
                        key={item}
                        onClick={() => setSelectedSubItem(isItemActive ? null : item)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                          isItemActive
                            ? 'bg-orange-600 text-white shadow-2xs font-bold'
                            : 'bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-800 border border-slate-200'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Active Filter Chips */}
          {(selectedCategory || selectedSubcategory || selectedSubItem || selectedBrand || searchQuery || filterChurchOnly) && (
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-600">
              <span className="font-semibold text-slate-400">Filtros ativos:</span>
              
              {selectedCategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                  <span>{activeCategoryObj?.name}</span>
                  <button onClick={() => { setSelectedCategory(null); setSelectedSubcategory(null); setSelectedSubItem(null); }} className="hover:text-rose-600 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubcategory && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-900 font-semibold shadow-2xs">
                  <span>Sub: {selectedSubcategory}</span>
                  <button onClick={() => { setSelectedSubcategory(null); setSelectedSubItem(null); }} className="hover:text-rose-600 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedSubItem && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-bold shadow-2xs">
                  <span>Tipo: {selectedSubItem}</span>
                  <button onClick={() => setSelectedSubItem(null)} className="hover:text-rose-600 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedBrand && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                  <span>Marca: {selectedBrand}</span>
                  <button onClick={() => setSelectedBrand(null)} className="hover:text-rose-600 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchQuery && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-800 font-medium shadow-2xs">
                  <span>"{searchQuery}"</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-rose-600 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {filterChurchOnly && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-800 font-bold shadow-2xs">
                  <span>Especial Igrejas</span>
                  <button onClick={() => setFilterChurchOnly(false)} className="hover:text-rose-600 ml-1">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={() => {
                  setSelectedCategory(null);
                  setSelectedSubcategory(null);
                  setSelectedSubItem(null);
                  setSelectedBrand(null);
                  setSearchQuery('');
                  setFilterChurchOnly(false);
                }}
                className="text-xs text-orange-600 hover:underline font-semibold ml-2"
              >
                Limpar todos os filtros
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

            {/* Categories & Subcategories Tree */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-400 uppercase tracking-wider">
                  Departamentos
                </h3>
                {selectedCategory && (
                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setSelectedSubcategory(null);
                      setSelectedSubItem(null);
                    }}
                    className="text-[10px] text-orange-600 hover:underline font-bold"
                  >
                    Ver todas
                  </button>
                )}
              </div>

              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    setSelectedCategory(null);
                    setSelectedSubcategory(null);
                    setSelectedSubItem(null);
                  }}
                  className={`w-full text-left py-2 px-3 rounded-xl transition-all flex items-center justify-between ${
                    selectedCategory === null
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 font-medium'
                  }`}
                >
                  <span>Todos os Produtos</span>
                  <span className="text-[10px] opacity-75">{products.length}</span>
                </button>

                {categories.map((cat) => {
                  const isCatSelected = selectedCategory === cat.slug;
                  const catProductsCount = products.filter(
                    (p) => p.categorySlug === cat.slug || p.category.toLowerCase() === cat.name.toLowerCase()
                  ).length;

                  return (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => {
                          if (isCatSelected) {
                            setSelectedCategory(null);
                            setSelectedSubcategory(null);
                            setSelectedSubItem(null);
                          } else {
                            setSelectedCategory(cat.slug);
                            setSelectedSubcategory(null);
                            setSelectedSubItem(null);
                          }
                        }}
                        className={`w-full text-left py-2 px-3 rounded-xl transition-all flex items-center justify-between ${
                          isCatSelected
                            ? 'bg-orange-50 text-orange-900 border border-orange-200 font-bold'
                            : 'text-slate-700 hover:bg-slate-50 font-medium'
                        }`}
                      >
                        <span className="truncate">{cat.name}</span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="text-[10px] text-slate-400">{catProductsCount}</span>
                          <span className={`text-[10px] transition-transform ${isCatSelected ? 'rotate-90 text-orange-600' : 'text-slate-300'}`}>›</span>
                        </div>
                      </button>

                      {/* Expanded Subcategories and Sub-items */}
                      {isCatSelected && (
                        <div className="pl-3.5 pr-1 py-1 space-y-1 border-l-2 border-orange-200 ml-3">
                          {(cat.subGroups || cat.subcategories.map(s => ({ id: s, name: s, slug: s }))).map((grp: any) => {
                            const isGrpSelected = selectedSubcategory === grp.name;
                            return (
                              <div key={grp.id || grp.name} className="space-y-0.5">
                                <button
                                  onClick={() => {
                                    if (isGrpSelected) {
                                      setSelectedSubcategory(null);
                                      setSelectedSubItem(null);
                                    } else {
                                      setSelectedSubcategory(grp.name);
                                      setSelectedSubItem(null);
                                    }
                                  }}
                                  className={`w-full text-left py-1 px-2 rounded-lg text-[11px] transition-colors flex items-center justify-between ${
                                    isGrpSelected
                                      ? 'bg-slate-900 text-white font-bold'
                                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                  }`}
                                >
                                  <span className="truncate">{grp.name}</span>
                                  {grp.items && grp.items.length > 0 && (
                                    <span className="text-[9px] opacity-60">({grp.items.length})</span>
                                  )}
                                </button>

                                {/* Level 3 items if group selected */}
                                {isGrpSelected && grp.items && grp.items.length > 0 && (
                                  <div className="pl-2 space-y-0.5 pt-0.5 pb-1">
                                    {grp.items.map((item: string) => {
                                      const isItemSelected = selectedSubItem === item;
                                      return (
                                        <button
                                          key={item}
                                          onClick={() => setSelectedSubItem(isItemSelected ? null : item)}
                                          className={`w-full text-left py-0.5 px-2 rounded text-[10px] transition-colors block truncate ${
                                            isItemSelected
                                              ? 'bg-orange-600 text-white font-bold'
                                              : 'text-slate-500 hover:text-orange-700 hover:bg-orange-50'
                                          }`}
                                        >
                                          • {item}
                                        </button>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
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
