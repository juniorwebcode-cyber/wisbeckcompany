import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  CheckCircle2, 
  Clock, 
  ShoppingBag, 
  ExternalLink, 
  MessageCircle, 
  Truck, 
  MapPin, 
  ShieldCheck, 
  RefreshCw, 
  ArrowLeft,
  QrCode,
  CreditCard,
  Building2,
  Copy
} from 'lucide-react';
import { useStore } from '../lib/store';
import { Order } from '../types';
import { checkInfinitePayPaymentStatus } from '../lib/infinitepay';

export const ObrigadoView: React.FC = () => {
  const { orders, settings, navigateToHome, setCurrentView, showToast, clearCart } = useStore();

  const [orderNsu, setOrderNsu] = useState<string>('');
  const [matchingOrder, setMatchingOrder] = useState<Order | null>(null);
  const [isCheckingPayment, setIsCheckingPayment] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'pending' | 'checking'>('checking');
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    // Extract nsu from URL search or hash
    const params = new URLSearchParams(window.location.search);
    let nsu = params.get('nsu') || params.get('order_nsu') || '';

    if (!nsu && window.location.hash.includes('nsu=')) {
      const hashParams = new URLSearchParams(window.location.hash.split('?')[1]);
      nsu = hashParams.get('nsu') || hashParams.get('order_nsu') || '';
    }

    // Fallback to most recent order in store
    if (!nsu && orders.length > 0) {
      nsu = orders[0].code;
    }

    setOrderNsu(nsu);

    const found = orders.find(
      (o) => o.code === nsu || (o as any).infinitePayNsu === nsu || o.id === nsu
    ) || (orders.length > 0 ? orders[0] : null);

    setMatchingOrder(found);

    if (found?.status === 'paid') {
      setPaymentStatus('paid');
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#10b981', '#0284c7', '#f59e0b'],
      });
    } catch (e) {
      // Confetti fallback
    }

    // Verify payment status with InfinitePay API
    if (nsu) {
      verifyPayment(nsu);
    }
  }, [orders]);

  const verifyPayment = async (nsuToVerify: string) => {
    setIsCheckingPayment(true);
    try {
      const res = await checkInfinitePayPaymentStatus(nsuToVerify);
      if (res.paid) {
        setPaymentStatus('paid');
        clearCart(); // <--- Clear here
        showToast('Pagamento confirmado via InfinitePay!', 'success');
      } else {
        setPaymentStatus('pending');
      }
    } catch (e) {
      setPaymentStatus('pending');
    } finally {
      setIsCheckingPayment(false);
    }
  };

  const handleOpenWhatsAppOrder = () => {
    if (!matchingOrder) return;
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const msg = encodeURIComponent(
      `Olá Wisbeck Company! Acabei de realizar o pedido ${matchingOrder.code} via Checkout InfinitePay (R$ ${matchingOrder.total.toFixed(2)}). Gostaria de confirmar meu envio!`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${msg}`, '_blank');
  };

  const handleCopyOrderCode = () => {
    if (!matchingOrder) return;
    navigator.clipboard.writeText(matchingOrder.code);
    setCopiedCode(true);
    showToast('Código do pedido copiado!', 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 sm:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Top return link */}
        <div className="flex items-center justify-between">
          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar para a Loja Virtual</span>
          </button>

          <span className="text-[11px] font-semibold text-slate-500">
            Showroom Itajaí/SC • www.wisbeckcompany.com.br
          </span>
        </div>

        {/* Hero Success Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl text-center space-y-5">
          
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border-2 border-emerald-200 mx-auto flex items-center justify-center shadow-xs">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 uppercase tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Checkout Oficial InfinitePay</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-950 font-heading tracking-tight">
              Pedido Realizado com Sucesso!
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Muito obrigado pela confiança na <strong className="text-slate-950 font-bold">Wisbeck Company</strong>. 
              Seu pedido foi registrado e está integrado ao sistema de checkout da InfinitePay.
            </p>
          </div>

          {/* InfinitePay Badge & Verification Status */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-900 text-emerald-400 flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                ∞ Pay
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Status do Pagamento InfinitePay</span>
                  {paymentStatus === 'paid' ? (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Aprovado • Pago
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-700" />
                      <span>Processando / Aguardando</span>
                    </span>
                  )}
                </p>
                <p className="text-[11px] text-slate-500">
                  Transação segura via Pix / Cartão
                </p>
              </div>
            </div>

            <button
              onClick={() => verifyPayment(orderNsu)}
              disabled={isCheckingPayment}
              className="px-3.5 py-2 rounded-lg bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs border border-slate-300 transition-colors flex items-center gap-1.5 shrink-0 self-stretch sm:self-auto justify-center"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isCheckingPayment ? 'animate-spin text-orange-600' : ''}`} />
              <span>{isCheckingPayment ? 'Verificando...' : 'Atualizar Status'}</span>
            </button>
          </div>

          {/* Order NSU identifier */}
          {orderNsu && (
            <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-orange-700 block">Identificador do Pedido (NSU):</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{orderNsu}</span>
              </div>
              <button
                onClick={handleCopyOrderCode}
                className="px-2.5 py-1.5 rounded-md bg-white text-orange-800 hover:bg-orange-100 border border-orange-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copiedCode ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleOpenWhatsAppOrder}
              className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-[1.01]"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Receber Código de Rastreio no WhatsApp</span>
            </button>

            <button
              onClick={() => setCurrentView('orders-tracker')}
              className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Acompanhar Meus Pedidos</span>
            </button>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        {matchingOrder && (
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading font-bold text-slate-950 text-sm">Resumo da Compra</h3>
                <p className="text-[11px] text-slate-500">Data: {new Date(matchingOrder.createdAt).toLocaleString('pt-BR')}</p>
              </div>
              <span className="font-bold text-slate-900 text-base font-heading">
                Total: R$ {matchingOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Customer & Delivery */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <span>Destinatário:</span>
                </span>
                <p className="text-slate-800 font-semibold">{matchingOrder.customer.name}</p>
                <p className="text-slate-500 text-[11px]">{matchingOrder.customer.email}</p>
                <p className="text-slate-500 text-[11px]">Tel: {matchingOrder.customer.phone}</p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 block flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-600" />
                  <span>Endereço de Entrega:</span>
                </span>
                <p className="text-slate-800">
                  {matchingOrder.address.street}, {matchingOrder.address.number} {matchingOrder.address.complement || ''}
                </p>
                <p className="text-slate-500 text-[11px]">
                  {matchingOrder.address.neighborhood} • {matchingOrder.address.city}/{matchingOrder.address.state} • CEP {matchingOrder.address.cep}
                </p>
                <p className="text-emerald-700 font-semibold text-[11px] flex items-center gap-1 pt-0.5">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Envio via {matchingOrder.freightOption?.name || 'Correios'}</span>
                </p>
              </div>
            </div>

            {/* Items List */}
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <span className="font-bold text-slate-900 text-xs block">Itens do Pedido:</span>
              <div className="divide-y divide-slate-100">
                {matchingOrder.items.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-contain bg-slate-50 border border-slate-200 p-0.5"
                      />
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">{item.name}</p>
                        <p className="text-[11px] text-slate-500">Qtd: {item.quantity}x • {item.brand}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-950 shrink-0">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial summary */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal dos produtos</span>
                <span>R$ {matchingOrder.subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              {matchingOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Desconto aplicado (PIX / Cupom)</span>
                  <span>- R$ {matchingOrder.discount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Frete</span>
                <span>{matchingOrder.freightPrice === 0 ? 'GRÁTIS' : `R$ ${matchingOrder.freightPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-950 pt-2 border-t border-slate-200 font-heading">
                <span>Total Pago via InfinitePay</span>
                <span>R$ {matchingOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

          </div>
        )}

        {/* Support Footer */}
        <div className="text-center space-y-2 pt-4">
          <p className="text-xs text-slate-500">
            Dúvidas sobre sua entrega ou nota fiscal? Fale com a equipe do showroom:
          </p>
          <p className="text-xs font-bold text-slate-800">
            WhatsApp: {settings.whatsapp} • {settings.address}, {settings.cityStateZip}
          </p>
        </div>

      </div>
    </div>
  );
};
