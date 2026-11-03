import React, { useState } from 'react';
import { 
  Church, 
  Mic2, 
  Volume2, 
  Headphones, 
  ShieldCheck, 
  MessageCircle
} from 'lucide-react';
import { useStore } from '../lib/store';

export const SolucoesIgrejasView: React.FC = () => {
  const { settings, navigateToCategory, showToast } = useStore();

  const [churchName, setChurchName] = useState('');
  const [responsibleName, setResponsibleName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [membersCount, setMembersCount] = useState('100 a 300 pessoas');
  const [needs, setNeeds] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const msg = `*PROJETO DE SOM PARA IGREJA - WISBECK COMPANY*
----------------------------------------
*Igreja:* ${churchName}
*Responsável:* ${responsibleName}
*WhatsApp:* ${phone}
*Cidade/UF:* ${city}
*Capacidade do Templo:* ${membersCount}
*Necessidade:* ${needs || 'Projeto e consultoria técnica de som'}
----------------------------------------
Solicito consultoria técnica com os especialistas da Wisbeck!`;

    window.open(`https://wa.me/55${cleanPhone}?text=${encodeURIComponent(msg)}`, '_blank');
    showToast('Proposta enviada para o WhatsApp da Wisbeck!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-14 shadow-xs">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-bold text-orange-700 uppercase tracking-wider bg-orange-50 px-2.5 py-1 rounded border border-orange-200">
              Especialidade Wisbeck Company
            </span>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-950 tracking-tight font-heading leading-tight">
              Sonorização e Inteligibilidade Vocal para Igrejas
            </h1>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Elimine ecos, microfonias no altar e garanta que cada membro ouça a Palavra com clareza, desde a primeira fileira até o fundo da nave do templo.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="#formulario-igreja"
                className="px-5 py-3 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm transition-colors shadow-xs"
              >
                Solicitar Consultoria Técnica
              </a>
              <button
                onClick={() => navigateToCategory('solucoes-para-igrejas')}
                className="px-5 py-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs sm:text-sm border border-slate-200 transition-colors"
              >
                Ver Equipamentos
              </button>
            </div>
          </div>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-950 font-heading">Inteligibilidade Vocal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ajuste de dispersão para que pregações sejam nítidas e confortáveis sem fadiga auditiva.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Mic2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-950 font-heading">Microfonia Zero</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Microfones Kadosh e Shure True Diversity imunes a quedas de sinal e interferências de celulares.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-950 font-heading">Monitoração In-Ear</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Substitua caixas de retorno volumosas por fones de ouvido individuais para a equipe de louvor.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-950 font-heading">Treinamento de Equipe</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Orientamos os voluntários da sua igreja a operar a mesa de som e periféricos com segurança.
            </p>
          </div>
        </div>

        {/* Form */}
        <div id="formulario-igreja" className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-12 max-w-3xl mx-auto space-y-6 shadow-xs">
          <div className="text-center space-y-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950 font-heading">
              Solicite uma Proposta Técnica para sua Igreja
            </h2>
            <p className="text-xs text-slate-500">
              Receba contato direto de um técnico especialista da Wisbeck Company em Itajaí/SC.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Nome da Igreja *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Igreja Presbiteriana de Itajaí"
                  value={churchName}
                  onChange={(e) => setChurchName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Seu Nome e Cargo *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Pr. Daniel / Líder de Som"
                  value={responsibleName}
                  onChange={(e) => setResponsibleName(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">WhatsApp de Contato *</label>
                <input
                  type="tel"
                  required
                  placeholder="(00) 00000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Cidade e Estado *</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Itajaí/SC"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Capacidade de Membros</label>
                <select
                  value={membersCount}
                  onChange={(e) => setMembersCount(e.target.value)}
                  className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:outline-none"
                >
                  <option value="Até 100 pessoas">Até 100 pessoas</option>
                  <option value="100 a 300 pessoas">100 a 300 pessoas</option>
                  <option value="300 a 800 pessoas">300 a 800 pessoas</option>
                  <option value="Mais de 1000 pessoas">Mais de 1.000 pessoas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Qual a principal necessidade hoje?</label>
              <textarea
                rows={3}
                placeholder="Ex: Microfones de altar com corte de microfonia, mesa digital para gravação das transmissões ao vivo..."
                value={needs}
                onChange={(e) => setNeeds(e.target.value)}
                className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              <MessageCircle className="w-4 h-4" />
              <span>ENVIAR PROPOSTA PARA O WHATSAPP DA WISBECK</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
