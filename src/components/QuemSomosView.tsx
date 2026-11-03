import React from 'react';
import { MapPin, Phone, Clock, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useStore } from '../lib/store';

export const QuemSomosView: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
            Nossa História
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-heading">
            Wisbeck Company
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {settings.slogan}
          </p>
        </div>

        {/* Narrative Section with Image */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
          <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <h2 className="text-lg sm:text-xl font-bold text-slate-950 font-heading">
              Paixão por Som de Verdade e Excelência Acústica
            </h2>
            <p>
              A <strong>Wisbeck Company</strong> nasceu com a missão de transformar a experiência acústica de igrejas, músicos, estúdios e espaços comerciais em Santa Catarina e em todo o território nacional.
            </p>
            <p>
              Com sede própria em Itajaí/SC na Rua José Gall, 650, nosso showroom oferece equipamentos oficiais das marcas líderes mundiais: Shure, JBL Professional, Yamaha, Behringer, Kadosh, Strinberg, Oneal e Santo Angelo.
            </p>
            <p>
              Mais do que vender equipamentos, entregamos <strong>projetos sonoros completos</strong> com consultoria personalizada e suporte técnico dedicado.
            </p>
          </div>

          <div className="relative aspect-video sm:aspect-square rounded-xl overflow-hidden border border-slate-200 shadow-xs">
            <img
              src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop"
              alt="Showroom Wisbeck Company"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <Award className="w-6 h-6 text-orange-600" />
            <h3 className="font-bold text-slate-950 text-sm">Produtos 100% Originais</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Revendedor autorizado com garantia de fábrica e Nota Fiscal eletrônica em todas as vendas.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <HeartHandshake className="w-6 h-6 text-amber-600" />
            <h3 className="font-bold text-slate-950 text-sm">Consultoria Especializada</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Técnicos de som experientes disponíveis via WhatsApp para orientar a melhor escolha técnica.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-slate-950 text-sm">Envio Seguro Correios</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Postagem rápida com seguro total e rastreamento oficial para qualquer município brasileiro.
            </p>
          </div>
        </div>

        {/* Physical Store Box */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-slate-950 font-heading">
              Showroom Físico em Itajaí/SC
            </h3>
            <div className="text-xs text-slate-600 space-y-1">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0" />
                <span>{settings.address} – {settings.cityStateZip}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.phone} / WhatsApp: {settings.whatsapp}</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const clean = settings.whatsapp.replace(/\D/g, '');
              window.open(`https://wa.me/55${clean}?text=${encodeURIComponent('Olá Wisbeck! Gostaria de agendar uma visita ao showroom em Itajaí.')}`, '_blank');
            }}
            className="px-5 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs shrink-0"
          >
            Agendar Visita no Showroom
          </button>
        </div>

      </div>
    </div>
  );
};
