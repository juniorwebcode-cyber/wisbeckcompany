import React from 'react';
import { 
  ArrowRight, 
  Church, 
  Speaker, 
  Music, 
  Volume2, 
  Mic, 
  Cable, 
  MessageCircle, 
  Flame, 
  Sparkles
} from 'lucide-react';
import { HeroBanner } from './HeroBanner';
import { ProductCard } from './ProductCard';
import { useStore } from '../lib/store';

export const HomeView: React.FC = () => {
  const {
    products,
    categories,
    brands,
    settings,
    navigateToCategory,
    navigateToBrand,
    setCurrentView,
  } = useStore();

  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const churchSpecial = products.filter((p) => p.isChurchSpecial).slice(0, 4);
  const newReleases = products.filter((p) => p.isNewRelease).slice(0, 4);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'audio-profissional': return <Speaker className="w-5 h-5 text-orange-600" />;
      case 'instrumentos-musicais': return <Music className="w-5 h-5 text-amber-600" />;
      case 'solucoes-para-igrejas': return <Church className="w-5 h-5 text-purple-600" />;
      case 'som-ambiente': return <Volume2 className="w-5 h-5 text-blue-600" />;
      case 'home-studio': return <Mic className="w-5 h-5 text-emerald-600" />;
      default: return <Cable className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-[#f8fafc]">
      
      {/* 1. Hero Banner */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* 2. Categorias em Destaque */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3.5">
            <div>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">
                Departamentos da Loja
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading">
                Categorias Principais
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('catalog')}
              className="group text-xs font-semibold text-slate-700 hover:text-orange-600 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <span>Ver catálogo completo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {categories.map((cat) => {
              const productCount = products.filter(
                (p) => p.categorySlug === cat.slug || p.category.toLowerCase() === cat.name.toLowerCase()
              ).length;

              return (
                <div
                  key={cat.id}
                  onClick={() => navigateToCategory(cat.slug)}
                  className="group modern-card p-4 sm:p-5 rounded-2xl border border-slate-200/80 hover:border-slate-300 hover:shadow-md cursor-pointer transition-all flex flex-col items-center text-center space-y-2.5 bg-white relative"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-50/80 border border-orange-200/60 flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-100/70 transition-all duration-300">
                    {getCategoryIcon(cat.slug)}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-slate-900 group-hover:text-orange-600 transition-colors leading-snug">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {productCount} itens
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 3. Mais Vendidos */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3.5">
            <div>
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span>Alta Procura</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading">
                Produtos Mais Vendidos
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('catalog')}
              className="group text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Ver todos os destaques</span>
              <ArrowRight className="w-3.5 h-3.5 text-orange-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 4. Soluções Especiais para Igrejas (Clean Modern Editorial Showcase) */}
        <section className="rounded-3xl bg-gradient-to-br from-white via-orange-50/40 to-amber-50/30 border border-orange-200/90 p-6 sm:p-10 lg:p-12 shadow-sm space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-orange-200/70 pb-6 relative z-10">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-bold text-orange-700 uppercase tracking-wider">
                <Church className="w-4 h-4 text-orange-600" />
                <span>Especialidade Wisbeck Company</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-950 font-heading leading-tight text-balance">
                Projetos e Equipamentos de Som para Igrejas & Templos
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                Microfonia zero, inteligibilidade cristalina das palavras e monitoração in-ear para o louvor. Elaboramos projetos personalizados com alinhamento acústico.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentView('church-solutions')}
                className="px-6 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-600/20 hover:shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-[0.98]"
              >
                <span>Solicitar Orçamento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  const clean = settings.whatsapp.replace(/\D/g, '');
                  window.open(`https://wa.me/55${clean}?text=${encodeURIComponent('Olá! Gostaria de consultar um especialista em som para igrejas.')}`, '_blank');
                }}
                className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-300 transition-all duration-200 shadow-xs flex items-center gap-2 active:scale-[0.98]"
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" />
                <span>Falar no WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Products Grid for Church */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
            {churchSpecial.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 5. Lançamentos e Novidades */}
        <section className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-slate-200/80 pb-3.5">
            <div>
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                <span>Novidades no Estoque</span>
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading">
                Lançamentos no Catálogo
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setCurrentView('catalog')}
              className="group text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <span>Ver todos os lançamentos</span>
              <ArrowRight className="w-3.5 h-3.5 text-blue-500 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newReleases.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* 6. Marcas Oficiais Parceiras */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Procedência e Garantia de Fábrica
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
              Marcas Líderes com Revenda Autorizada
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {brands.map((b) => (
              <div
                key={b.id}
                onClick={() => navigateToBrand(b.name)}
                className="bg-slate-50/70 hover:bg-slate-50 p-4 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all duration-200 text-center flex flex-col items-center justify-center group"
              >
                <span className="font-extrabold text-sm text-slate-900 font-heading tracking-wide group-hover:text-orange-600 transition-colors">
                  {b.name}
                </span>
                <span className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">
                  {b.tagline || 'Distribuidor Oficial'}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Provas Sociais e Depoimentos de Clientes */}
        <section className="space-y-4">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider">
              Avaliações Verificadas
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-950 font-heading">
              O que dizem os técnicos e pastores que confiam na Wisbeck
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {[
              {
                name: 'Pr. Marcelo Ribeiro',
                role: 'Igreja Batista Vida Nova – Itajaí/SC',
                text: 'Equipamos todo o nosso templo com o sistema de som e microfones sem fio da Wisbeck. Inteligibilidade vocal impecável nas pregações e zero ruído!',
                rating: 5,
              },
              {
                name: 'André Martins',
                role: 'Engenheiro de Áudio & Produtor Musical – Joinville/SC',
                text: 'As mesas de som digitais e as caixas ativas JBL vieram lacradas, com nota fiscal e garantia oficial. Chegou em 24h via SEDEX.',
                rating: 5,
              },
              {
                name: 'Carlos Eduardo',
                role: 'Diretor de Operações – Auditórios & Eventos SC',
                text: 'A consultoria acústica da Wisbeck evitou que gastássemos dinheiro à toa. Dimensionamento perfeito de potência e caixas de som ambiente.',
                rating: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed italic">
                    "{t.text}"
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <p className="font-bold text-xs text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. WhatsApp Specialist Callout Strip */}
        <section className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200/90 p-6 sm:p-10 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800">
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Showroom em Itajaí/SC • Atendimento para Todo o Brasil</span>
            </div>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-950 font-heading">
              Dúvidas sobre compatibilidade, potência ou alinhamento de som?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Nossa equipe de consultores técnicos e músicos analisa as dimensões do seu espaço e elabora uma recomendação sob medida sem custo.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const clean = settings.whatsapp.replace(/\D/g, '');
              window.open(`https://wa.me/55${clean}?text=${encodeURIComponent('Olá Wisbeck Company! Gostaria de uma consultoria técnica de som para meu projeto.')}`, '_blank');
            }}
            className="px-6 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-emerald-600/20 hover:shadow-lg shrink-0 flex items-center gap-2 active:scale-[0.98]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>FALAR COM ESPECIALISTA NO WHATSAPP</span>
          </button>
        </section>

      </div>
    </div>
  );
};
