import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  MessageCircle, 
  ShieldCheck, 
  Lock,
  Church,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../lib/store';

export const Footer: React.FC = () => {
  const { settings, setCurrentView, navigateToCategory, openAdminLogin } = useStore();

  const handleWhatsApp = () => {
    const clean = settings.whatsapp.replace(/\D/g, '');
    window.open(`https://wa.me/55${clean}?text=${encodeURIComponent('Olá Wisbeck! Gostaria de falar com um consultor técnico.')}`, '_blank');
  };

  return (
    <footer className="bg-white text-slate-600 border-t border-slate-200 pt-12 pb-8 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-200 text-xs">
          
          {/* Col 1: Brand (Enlarged) */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3">
              <img
                src="https://i.postimg.cc/7YZqgm6W/Logo-corporativo-WISBECK-com-gradiente-colorido.png"
                alt="Wisbeck Company - Som Profissional & Instrumentos Musicais"
                className="h-14 sm:h-16 w-auto object-contain"
              />
              <div className="flex flex-col">
                <span className="font-heading font-black text-xl sm:text-2xl text-slate-950 tracking-tight leading-none">
                  WISBECK <span className="text-orange-600">COMPANY</span>
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mt-1">
                  Som Profissional & Instrumentos
                </span>
              </div>
            </div>
            <p className="text-slate-500 leading-relaxed text-xs">
              Referência em <strong className="text-slate-800">Som Profissional</strong>, <strong className="text-slate-800">Instrumentos Musicais</strong>, <strong className="text-slate-800">Soluções para Igrejas</strong> e Sonorização de Ambientes em Itajaí/SC.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <a
                href={`https://instagram.com/${settings.instagram.replace('@', '')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                title="Instagram Oficial"
              >
                <Instagram className="w-3.5 h-3.5 text-pink-600" />
                <span>@wisbeckcompany</span>
              </a>
              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-colors border border-emerald-200"
                title="WhatsApp Oficial"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Col 2: Departamentos */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Departamentos
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  onClick={() => navigateToCategory('audio-profissional')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Áudio Profissional & Mesas Digitais
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('instrumentos-musicais')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Instrumentos Musicais & Guitarras
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('church-solutions')}
                  className="text-orange-700 hover:text-orange-800 font-semibold flex items-center gap-1"
                >
                  <Church className="w-3.5 h-3.5 text-orange-600" />
                  Soluções para Igrejas e Templos
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('som-ambiente')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Sonorização Comercial & Arandelas
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('home-studio')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Home Studio & Microfones Condensadores
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToCategory('cabos-acessorios')}
                  className="hover:text-orange-600 transition-colors"
                >
                  Cabos Santo Angelo & Conectores
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Suporte & Institucional */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Atendimento & Suporte
            </h4>
            <ul className="space-y-1.5 text-slate-600">
              <li>
                <button
                  onClick={() => setCurrentView('orders-tracker')}
                  className="hover:text-slate-900"
                >
                  Rastrear Meu Pedido (Correios)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('about')}
                  className="hover:text-slate-900"
                >
                  Quem Somos & Nossa História
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentView('contact')}
                  className="hover:text-slate-900"
                >
                  Showroom Físico & Projetos
                </button>
              </li>
              <li>
                <span className="text-slate-400">Garantia Nacional com Nota Fiscal</span>
              </li>
              <li>
                <span className="text-slate-400">Devolução gratuita em até 7 dias</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Endereço Showroom */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Loja Física & Showroom
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-800 block">Wisbeck Company</strong>
                  {settings.address}<br />
                  {settings.cityStateZip}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.phone} / {settings.whatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Ambiente Seguro com Criptografia SSL e Entrega Correios</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Admin Button and Payment Methods */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} Wisbeck Company – Som Profissional & Instrumentos Musicais. Todos os direitos reservados.
          </div>

          {/* Admin Area Button */}
          <div className="flex items-center justify-center">
            <button
              onClick={() => openAdminLogin()}
              className="text-slate-600 hover:text-slate-900 font-semibold transition-all flex items-center gap-1.5 py-1.5 px-3 rounded-lg hover:bg-slate-100 border border-slate-200 hover:border-slate-300 shadow-2xs"
              title="Acesso Administrativo da Loja"
            >
              <Lock className="w-3.5 h-3.5 text-orange-600" />
              <span>Área Administrativa</span>
            </button>
          </div>

          {/* Payments accepted */}
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] text-emerald-800 font-bold">
              PIX 10% OFF
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px]">
              Cartão até 12x
            </span>
            <span className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px]">
              Boleto
            </span>
          </div>
        </div>

        {/* Fale Conosco - Logo abaixo do Admin */}
        <div className="mt-6 pt-5 border-t border-slate-200/90 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200">
          <div className="text-center sm:text-left space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-600 flex items-center justify-center sm:justify-start gap-1">
              <span>Atendimento Direto</span>
            </span>
            <h4 className="text-xs font-bold text-slate-900 font-heading">
              Fale Conosco — Canais Oficiais Wisbeck Company
            </h4>
            <p className="text-[11px] text-slate-500">
              Showroom físico em Itajaí/SC ou suporte técnico especializado online.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Link WhatsApp */}
            <a
              href="https://wa.me/5547996288524?text=Ol%C3%A1%2C%20gostaria%20de%20falar%20com%20a%20Wisbeck%20Company%20sobre%20produtos%20de%20som%20e%20instrumentos."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp: (47) 99628-8524</span>
            </a>

            {/* Link Google Maps */}
            <a
              href="https://maps.google.com/?q=Rua+Jos%C3%A9+Gall,+650+-+Dom+Bosco,+Itaja%C3%AD+-+SC,+88307-100"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold transition-all border border-slate-300 shadow-2xs hover:border-slate-400 active:scale-95"
            >
              <MapPin className="w-3.5 h-3.5 text-orange-600" />
              <span>Ver no Google Maps</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            {/* Link Rede Social (Instagram) */}
            <a
              href="https://instagram.com/wisbeckcompany"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Instagram: @wisbeckcompany</span>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
};
