import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Church, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  MapPin, 
  ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';

export const HeroBanner: React.FC = () => {
  const { navigateToCategory, setCurrentView } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      tag: 'ESPECIALIDADE WISBECK',
      title: 'Sonorização e Acústica para Igrejas & Templos',
      description: 'Projetos sob medida em Santa Catarina e em todo o Brasil. Microfonia de alta estabilidade, inteligibilidade vocal nas pregações e monitoração in-ear para o louvor.',
      primaryCta: 'Consultoria para Igrejas',
      primaryAction: () => setCurrentView('church-solutions'),
      secondaryCta: 'Ver Equipamentos',
      secondaryAction: () => navigateToCategory('solucoes-para-igrejas'),
      image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 2,
      tag: 'ÁUDIO PROFISSIONAL',
      title: 'Shure, JBL Pro, Yamaha e Behringer com 10% OFF no PIX',
      description: 'Mesas digitais consagradas, caixas acústicas ativas e microfones sem fio com procedência oficial, garantia de fábrica e nota fiscal.',
      primaryCta: 'Explorar Áudio Profissional',
      primaryAction: () => navigateToCategory('audio-profissional'),
      secondaryCta: 'Ver Mais Vendidos',
      secondaryAction: () => navigateToCategory('audio-profissional'),
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1400&auto=format&fit=crop',
    },
    {
      id: 3,
      tag: 'SONORIZAÇÃO COMERCIAL',
      title: 'Som Ambiente de Alta Fidelidade para Empresas',
      description: 'Arandelas de gesso, caixas de sobrepor JBL e amplificadores multiroom com Bluetooth para clínicas, lojas, academias e auditórios.',
      primaryCta: 'Ver Linha Som Ambiente',
      primaryAction: () => navigateToCategory('som-ambiente'),
      secondaryCta: 'Falar com Especialista',
      secondaryAction: () => setCurrentView('contact'),
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=1400&auto=format&fit=crop',
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="w-full bg-[#f8fafc] border-b border-slate-200/80 relative overflow-hidden">
      
      {/* Background Subtle Ambient Aura with Logo Gradient Colors */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Hero Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-lg shadow-slate-200/50 min-h-[460px] sm:min-h-[520px] flex items-center">
          
          {/* Split Background Image with Clean Gradient Scrim */}
          <div className="absolute inset-0 z-0">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center transition-all duration-700 ease-out"
            />
            {/* White to transparent gradient mask for ultra clear legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 sm:via-white/90 to-transparent sm:to-white/10" />
            <div className="absolute inset-y-0 left-0 w-2 bg-wisbeck-gradient" />
          </div>

          {/* Slide Content */}
          <div className="relative z-10 max-w-2xl p-6 sm:p-12 lg:p-16 space-y-5">
            
            {/* Clean Unboxed Kicker */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-wider uppercase text-orange-700">
              <span className="w-2 h-2 rounded-full bg-orange-500" />
              <span>{slide.tag}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-950 leading-[1.12] font-heading tracking-tight text-balance">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl font-normal">
              {slide.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={slide.primaryAction}
                className="group flex items-center gap-2.5 bg-slate-950 hover:bg-slate-900 text-white px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 shadow-md shadow-slate-950/15 hover:shadow-lg hover:shadow-slate-950/20 active:scale-[0.98]"
              >
                <span>{slide.primaryCta}</span>
                <ArrowRight className="w-4 h-4 text-orange-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={slide.secondaryAction}
                className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-800 bg-white/90 backdrop-blur-xs hover:bg-white hover:text-slate-950 border border-slate-300/90 hover:border-slate-400 transition-all duration-200 shadow-xs active:scale-[0.98]"
              >
                {slide.secondaryCta}
              </button>
            </div>

          </div>

          {/* Carousel Arrows */}
          <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))}
              className="w-10 h-10 rounded-xl bg-white/95 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
              className="w-10 h-10 rounded-xl bg-white/95 hover:bg-white border border-slate-200/90 text-slate-700 hover:text-slate-950 flex items-center justify-center transition-all shadow-xs hover:shadow-md active:scale-95"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Slide Indicator Tabs */}
          <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx ? 'w-8 bg-slate-950' : 'w-2 bg-slate-300 hover:bg-slate-400'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>

      {/* Elevated Trust Strip */}
      <div className="bg-white border-t border-slate-200/90 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-xs text-slate-600">
          
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0 border border-orange-200/70">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">Envio Rápido & Seguro</p>
              <p className="text-[11px] text-slate-500">PAC & SEDEX Correios com seguro total</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/70">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">10% OFF no PIX à Vista</p>
              <p className="text-[11px] text-slate-500">Ou em até 12x sem juros no cartão</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/70">
              <Church className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">Especialistas em Igrejas</p>
              <p className="text-[11px] text-slate-500">Engenharia acústica para templos</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/70">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">Showroom em Itajaí/SC</p>
              <p className="text-[11px] text-slate-500">Rua José Gall, 650 – Dom Bosco</p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
