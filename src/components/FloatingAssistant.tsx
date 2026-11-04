import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  MessageCircle, 
  MapPin, 
  Truck, 
  CreditCard, 
  Church, 
  Music, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  actionButtons?: {
    label: string;
    url: string;
    icon: 'whatsapp' | 'instagram' | 'maps';
    variant: 'emerald' | 'pink' | 'blue';
  }[];
}

const HUMAN_AVATAR = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop';

const QUICK_TOPICS = [
  { id: 'whatsapp', label: '💬 Falar no WhatsApp', icon: MessageCircle },
  { id: 'pix', label: '💳 Desconto PIX 10%', icon: CreditCard },
  { id: 'igrejas', label: '⛪ Som para Igrejas', icon: Church },
  { id: 'violao', label: '🎸 Violão Nylon vs Aço', icon: Music },
  { id: 'frete', label: '🚚 Frete e Envio', icon: Truck },
  { id: 'showroom', label: '📍 Onde fica o Showroom?', icon: MapPin },
];

export const FloatingAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadBadge, setUnreadBadge] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: 'Olá! Seja muito bem-vindo(a) à Wisbeck Company! 👋\n\nSou a Juliana, sua consultora virtual de áudio e instrumentos musicais. Como posso te orientar hoje?',
      timestamp: 'Agora',
      actionButtons: [
        {
          label: 'Chamar no WhatsApp Oficial',
          url: 'https://wa.me/5547996288524?text=Ol%C3%A1%20Juliana!%20Vim%20pelo%20site%20da%20Wisbeck%20Company%20e%20gostaria%20de%20atendimento.',
          icon: 'whatsapp',
          variant: 'emerald',
        },
        {
          label: 'Ver Novidades no Instagram',
          url: 'https://instagram.com/wisbeckcompany',
          icon: 'instagram',
          variant: 'pink',
        },
      ],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadBadge(false);
    }
  }, [isOpen, messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateBotResponse(text);
      setMessages((prev) => [...prev, reply]);
      setIsTyping(false);
    }, 700);
  };

  const generateBotResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // WhatsApp Direct
    if (q.includes('whatsapp') || q.includes('zap') || q.includes('contato') || q.includes('atendente') || q.includes('humano') || q.includes('falar')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'Nossa equipe de consultores técnicos e especialistas de som está pronta para te atender no WhatsApp oficial da Wisbeck Company! Clique no botão abaixo para iniciar uma conversa direta:',
        timestamp,
        actionButtons: [
          {
            label: 'Conversar agora: (47) 99628-8524',
            url: `https://wa.me/5547996288524?text=Ol%C3%A1%20Wisbeck!%20Gostaria%20de%20falar%20com%20um%20especialista.%20(Pergunta:%20${encodeURIComponent(query)})`,
            icon: 'whatsapp',
            variant: 'emerald',
          },
        ],
      };
    }

    // Instagram
    if (q.includes('instagram') || q.includes('insta') || q.includes('rede social') || q.includes('foto') || q.includes('vídeo') || q.includes('video')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'No nosso Instagram @wisbeckcompany compartilhamos testes reais de caixas, mesas digitais, guitarras, violões e bastidores de instalações em igrejas e palcos!',
        timestamp,
        actionButtons: [
          {
            label: 'Seguir @wisbeckcompany no Instagram',
            url: 'https://instagram.com/wisbeckcompany',
            icon: 'instagram',
            variant: 'pink',
          },
          {
            label: 'Tirar dúvidas no WhatsApp',
            url: 'https://wa.me/5547996288524',
            icon: 'whatsapp',
            variant: 'emerald',
          },
        ],
      };
    }

    // PIX / Pagamento / Desconto
    if (q.includes('pix') || q.includes('pagamento') || q.includes('cartao') || q.includes('cartão') || q.includes('parcel') || q.includes('desconto')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '💰 Condições de pagamento na Wisbeck Company:\n\n• **10% de Desconto Imediato** no PIX com confirmação em segundos e aprovação automática.\n• Cartão de crédito em até **12x** (sem juros em itens selecionados).\n• Faturamento direto para Igrejas e Empresas mediante análise cadastral.',
        timestamp,
        actionButtons: [
          {
            label: 'Solicitar cotação no WhatsApp',
            url: 'https://wa.me/5547996288524?text=Ol%C3%A1!%20Gostaria%20de%20saber%20mais%20sobre%20as%20condi%C3%A7%C3%B5es%20de%20pagamento%20e%20desconto%20no%20PIX.',
            icon: 'whatsapp',
            variant: 'emerald',
          },
        ],
      };
    }

    // Frete / Envio / Prazo
    if (q.includes('frete') || q.includes('envio') || q.includes('entrega') || q.includes('correios') || q.includes('prazo') || q.includes('transportadora')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📦 Envios para Todo o Brasil:\n\n• Despachamos diariamente com seguro total via Correios (PAC / Sedex) e transportadoras especializadas em instrumentos e caixas acústicas pesadas.\n• **Frete Grátis** para compras acima de R$ 499,00.\n• Todos os produtos são enviados com Nota Fiscal e garantia oficial de fábrica.',
        timestamp,
        actionButtons: [
          {
            label: 'Calcular frete rápido no WhatsApp',
            url: 'https://wa.me/5547996288524?text=Ol%C3%A1!%20Gostaria%20de%20calcular%20o%20frete%20para%20o%20meu%20CEP.',
            icon: 'whatsapp',
            variant: 'emerald',
          },
        ],
      };
    }

    // Violão / Corda / Instrumentos
    if (q.includes('violao') || q.includes('violão') || q.includes('nylon') || q.includes('aço') || q.includes('aco') || q.includes('guitarra') || q.includes('corda')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '🎸 Sobre Violões e Cordas:\n\n• **Violão Nylon**: Toque macio, som aveludado e confortável. Muito indicado para clássico, MPB, bossa nova e iniciantes (ex: Yamaha C40, Tagima Modena).\n• **Violão Corda de Aço (Folk)**: Timbre brilhante, com projeção encorpada e sustain potente para pop, rock e ministérios de louvor (ex: Strinberg SD200C).\n\nNosso luthier e consultor pode te mandar vídeos demonstrativos no WhatsApp!',
        timestamp,
        actionButtons: [
          {
            label: 'Pedir áudio/vídeo no WhatsApp',
            url: 'https://wa.me/5547996288524?text=Ol%C3%A1!%20Gostaria%20de%20ver%20v%C3%ADdeos%20e%20dicas%20sobre%20os%20viol%C3%B5es%20da%20loja.',
            icon: 'whatsapp',
            variant: 'emerald',
          },
          {
            label: 'Ver demonstrações no Instagram',
            url: 'https://instagram.com/wisbeckcompany',
            icon: 'instagram',
            variant: 'pink',
          },
        ],
      };
    }

    // Igrejas e Projetos de Som
    if (q.includes('igreja') || q.includes('templo') || q.includes('projeto') || q.includes('acustica') || q.includes('acústica') || q.includes('mesa') || q.includes('microfone')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '⛪ Soluções Especializadas para Igrejas:\n\n• Dimensionamento acústico completo sem compromisso.\n• Microfonia zero, inteligibilidade da voz pastoral e alinhamento de line array.\n• Mesas digitais com controle individual de fones para os músicos via celular.\n• Condições especiais de pagamento direto para diretorias e lideranças.',
        timestamp,
        actionButtons: [
          {
            label: 'Falar com Consultor de Som de Igrejas',
            url: 'https://wa.me/5547996288524?text=Ol%C3%A1!%20Sou%20de%20uma%20igreja%20e%20gostaria%20de%20uma%20consultoria%20de%20%C3%A1udio%20especializada.',
            icon: 'whatsapp',
            variant: 'emerald',
          },
        ],
      };
    }

    // Showroom / Endereço / Localização
    if (q.includes('onde') || q.includes('showroom') || q.includes('loja') || q.includes('endereco') || q.includes('endereço') || q.includes('itajaí') || q.includes('itajai') || q.includes('visitar')) {
      return {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: '📍 Nosso Showroom Oficial Wisbeck:\n\nRua José Gall, nº 650 – Bairro Dom Bosco, Itajaí/SC – CEP 88307-100.\n\nHorário de atendimento:\n• Segunda a Sexta: 08:30 às 18:30\n• Sábados: 09:00 às 13:00\n\nVenha testar instrumentos e caixas acústicas ao vivo com nossa equipe técnica!',
        timestamp,
        actionButtons: [
          {
            label: 'Abrir no Google Maps',
            url: 'https://maps.google.com/?q=Rua+Jos%C3%A9+Gall,+650+-+Dom+Bosco,+Itaja%C3%AD+-+SC,+88307-100',
            icon: 'maps',
            variant: 'blue',
          },
          {
            label: 'Avisar visita no WhatsApp',
            url: 'https://wa.me/5547996288524?text=Ol%C3%A1!%20Gostaria%20de%20agendar%20uma%20visita%20ao%20Showroom%20em%20Itaja%C3%AD.',
            icon: 'whatsapp',
            variant: 'emerald',
          },
        ],
      };
    }

    // Resposta padrão amigável direcionando para canais oficiais
    return {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: `Excelente pergunta! Para detalhes específicos sobre valores, disponibilidade imediata de estoque ou cotações personalizadas, nosso especialista está conectado no WhatsApp e no Instagram oficial. Clique abaixo para ser atendido sem espera:`,
      timestamp,
      actionButtons: [
        {
          label: 'Chamar no WhatsApp: (47) 99628-8524',
          url: `https://wa.me/5547996288524?text=Ol%C3%A1%20Wisbeck!%20Gostaria%20de%20tirar%20uma%20d%C3%BAvida:%20${encodeURIComponent(query)}`,
          icon: 'whatsapp',
          variant: 'emerald',
        },
        {
          label: 'Acompanhar no Instagram @wisbeckcompany',
          url: 'https://instagram.com/wisbeckcompany',
          icon: 'instagram',
          variant: 'pink',
        },
      ],
    };
  };

  return (
    <>
      {/* Floating Left Dock (Does not overlap essential layout elements) */}
      <aside 
        aria-label="Atendimento Flutuante Wisbeck"
        className="fixed bottom-5 left-4 sm:left-6 z-40 flex flex-col items-start gap-2.5 pointer-events-auto"
      >
        
        {/* Virtual Assistant Chat Window */}
        {isOpen && (
          <div className="w-[calc(100vw-2rem)] sm:w-96 max-w-[400px] h-[480px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
            
            {/* Chat Header with Human Avatar */}
            <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-orange-950 text-white p-3.5 flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <img
                    src={HUMAN_AVATAR}
                    alt="Juliana • Consultora Wisbeck"
                    className="w-10 h-10 rounded-full object-cover border-2 border-emerald-400 shadow-sm"
                  />
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-heading font-bold text-sm text-white">Juliana</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-400/30">
                      Online
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-300">
                    Consultora Wisbeck • Resposta Imediata
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimizar atendimento"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Fechar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Contact Banner */}
            <div className="bg-slate-50 border-b border-slate-200 px-3 py-1.5 flex items-center justify-between text-[11px] text-slate-600 shrink-0">
              <span className="font-medium flex items-center gap-1">
                <Clock className="w-3 h-3 text-orange-600" />
                <span>Showroom & Atendimento Itajaí/SC</span>
              </span>
              <a
                href="https://wa.me/5547996288524"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
              >
                <span>(47) 99628-8524</span>
              </a>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-3 bg-[#fbfcfd] text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs whitespace-pre-line leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}

                    {/* Action buttons embedded in message */}
                    {msg.actionButtons && msg.actionButtons.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-col gap-1.5">
                        {msg.actionButtons.map((btn, idx) => (
                          <a
                            key={idx}
                            href={btn.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center justify-between px-3 py-2 rounded-xl text-[11px] font-bold transition-all shadow-2xs ${
                              btn.variant === 'emerald'
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : btn.variant === 'pink'
                                ? 'bg-pink-50 hover:bg-pink-100 text-pink-900 border border-pink-300'
                                : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-300'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              {btn.icon === 'whatsapp' && (
                                <svg className="w-4 h-4 fill-[#25D366] shrink-0" viewBox="0 0 24 24">
                                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.898-.788-3.12-2.73-3.215-2.856-.095-.126-.777-1.033-.777-1.97 0-.937.49-1.396.664-1.587.174-.191.381-.239.508-.239s.254.004.365.011c.118.007.276-.045.432.33.16.386.549 1.341.597 1.439.048.099.08.214.015.341-.065.127-.097.206-.192.316-.095.11-.202.247-.288.332-.096.095-.196.198-.084.39.112.192.498.822 1.07 1.332.737.656 1.358.859 1.55 1.055.192.196.303.174.415.048.112-.127.478-.557.605-.747.127-.19.255-.159.43-.095.175.064 1.112.525 1.303.62.191.096.318.143.365.223.048.079.048.461-.096.866z"/>
                                </svg>
                              )}
                              {btn.icon === 'instagram' && (
                                <svg className="w-4 h-4 fill-[#E4405F] shrink-0" viewBox="0 0 24 24">
                                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                              )}
                              {btn.icon === 'maps' && <MapPin className="w-4 h-4 text-blue-600 shrink-0" />}
                              <span>{btn.label}</span>
                            </span>
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 p-2 bg-white rounded-xl border border-slate-200 w-20 shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Topic Chips */}
            <div className="bg-white border-t border-slate-100 p-2 overflow-x-auto shrink-0 flex gap-1.5 scrollbar-none">
              {QUICK_TOPICS.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => handleSendMessage(topic.label)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 hover:bg-orange-50 hover:text-orange-700 text-slate-700 border border-slate-200 transition-colors shrink-0 flex items-center gap-1"
                >
                  <span>{topic.label}</span>
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua dúvida ou produto..."
                className="flex-1 bg-slate-50 text-slate-900 placeholder:text-slate-400 text-xs px-3 py-2 rounded-xl border border-slate-200 focus:bg-white focus:border-slate-900 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white transition-colors"
                title="Enviar mensagem"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}

        {/* Floating Trigger Dock Row (Human avatar + WhatsApp + Instagram) */}
        <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-slate-200/80 hover:shadow-2xl transition-all">
          
          {/* Virtual Assistant Button with Real Human Photo Avatar */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="group relative flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-sm"
            title="Abrir Assistente Virtual Wisbeck"
          >
            <div className="relative">
              <img
                src={HUMAN_AVATAR}
                alt="Juliana • Atendimento Wisbeck"
                className="w-9 h-9 rounded-full object-cover border-2 border-white/90 group-hover:scale-105 transition-transform"
              />
              {/* Online Dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-slate-900 rounded-full animate-pulse"></span>
            </div>

            <div className="text-left hidden xs:block sm:block pr-1">
              <span className="text-[11px] font-bold block leading-tight text-white flex items-center gap-1">
                <span>Assistente</span>
                <Sparkles className="w-2.5 h-2.5 text-orange-400" />
              </span>
              <span className="text-[9px] text-emerald-400 font-semibold block leading-tight">
                Online agora
              </span>
            </div>

            {unreadBadge && !isOpen && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-orange-600 border-2 border-white text-[8px] font-bold text-white rounded-full flex items-center justify-center">
                1
              </span>
            )}
          </button>

          <div className="h-6 w-px bg-slate-200 mx-0.5"></div>

          {/* Official WhatsApp Button */}
          <a
            href="https://wa.me/5547996288524?text=Ol%C3%A1%20Wisbeck%20Company!%20Gostaria%20de%20atendimento%20t%C3%A9cnico."
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20bd5a] flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95"
            title="Conversar no WhatsApp Oficial ((47) 99628-8524)"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.18-.544-1.898-.788-3.12-2.73-3.215-2.856-.095-.126-.777-1.033-.777-1.97 0-.937.49-1.396.664-1.587.174-.191.381-.239.508-.239s.254.004.365.011c.118.007.276-.045.432.33.16.386.549 1.341.597 1.439.048.099.08.214.015.341-.065.127-.097.206-.192.316-.095.11-.202.247-.288.332-.096.095-.196.198-.084.39.112.192.498.822 1.07 1.332.737.656 1.358.859 1.55 1.055.192.196.303.174.415.048.112-.127.478-.557.605-.747.127-.19.255-.159.43-.095.175.064 1.112.525 1.303.62.191.096.318.143.365.223.048.079.048.461-.096.866zM12 2C6.477 2 2 6.477 2 12c0 1.891.524 3.662 1.435 5.176L2 22l4.982-1.393C8.423 21.499 10.158 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
            </svg>
            <span className="sr-only">WhatsApp</span>
          </a>

          {/* Official Instagram Button */}
          <a
            href="https://instagram.com/wisbeckcompany"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] hover:opacity-95 flex items-center justify-center text-white shadow-md transition-all hover:scale-110 active:scale-95"
            title="Seguir Instagram Oficial (@wisbeckcompany)"
          >
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="sr-only">Instagram</span>
          </a>

        </div>

      </aside>
    </>
  );
};
