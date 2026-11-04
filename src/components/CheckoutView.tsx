import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, 
  Check, 
  MapPin, 
  Truck, 
  CreditCard, 
  ShieldCheck, 
  QrCode, 
  MessageCircle, 
  Loader2, 
  Lock, 
  Copy, 
  Building2,
  AlertCircle,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { CustomerInfo, Address, FreightOption, Order } from '../types';
import { useStore } from '../lib/store';
import { fetchAddressByCep, calculateCorreiosFreight, formatCep, cleanCep } from '../lib/correios';
import { createInfinitePayCheckoutLink, toCents, InfinitePayItem } from '../lib/infinitepay';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    settings,
    activeCoupon,
    createOrder,
    clearCart,
    navigateToHome,
    showToast,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [customer, setCustomer] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    cpf: '',
  });

  const [address, setAddress] = useState<Address>({
    cep: '',
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
  });

  const [isFetchingCep, setIsFetchingCep] = useState(false);
  const [freightOptions, setFreightOptions] = useState<FreightOption[]>([]);
  const [selectedFreight, setSelectedFreight] = useState<FreightOption | null>(null);

  const [paymentChoice, setPaymentChoice] = useState<'PIX' | 'CREDIT_CARD'>('PIX');
  const [installments, setInstallments] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutRedirectUrl, setCheckoutRedirectUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  let couponDiscount = 0;
  if (activeCoupon) {
    if (activeCoupon.discountType === 'percentage') {
      couponDiscount = (subtotal * activeCoupon.value) / 100;
    } else {
      couponDiscount = Math.min(subtotal, activeCoupon.value);
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const pixDiscount = paymentChoice === 'PIX' ? (discountedSubtotal * settings.pixDiscountPercent) / 100 : 0;
  const freightPrice = selectedFreight ? selectedFreight.price : 0;
  const total = discountedSubtotal - pixDiscount + freightPrice;
  const totalWeight = cart.reduce((acc, it) => acc + (it.product.weightKg || 1) * it.quantity, 0);

  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setAddress((prev) => ({ ...prev, cep: formatted }));

    const cleaned = cleanCep(value);
    if (cleaned.length === 8) {
      setIsFetchingCep(true);
      try {
        const data = await fetchAddressByCep(cleaned);
        if (data && data.state) {
          setAddress((prev) => ({
            ...prev,
            street: data.street || prev.street,
            neighborhood: data.neighborhood || prev.neighborhood,
            city: data.city || prev.city,
            state: data.state || prev.state,
          }));

          const options = calculateCorreiosFreight(
            data.state,
            totalWeight,
            subtotal,
            settings.freeShippingThreshold
          );
          setFreightOptions(options);
          setSelectedFreight(options[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsFetchingCep(false);
      }
    }
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.email.trim()) {
      showToast('Por favor preencha nome, e-mail e WhatsApp.', 'error');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.cep || !address.street || !address.number || !address.city || !address.state) {
      showToast('Por favor preencha todos os campos do endereço.', 'error');
      return;
    }
    if (!selectedFreight) {
      showToast('Selecione uma opção de envio Correios.', 'error');
      return;
    }
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalizeOrder = async () => {
    if (!selectedFreight) {
      showToast('Selecione uma opção de envio.', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const orderItems = cart.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        brand: item.product.brand,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images[0],
      }));

      // Unique order NSU identifier for InfinitePay
      const orderNsu = `PEDIDO-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

      // Save order in local store and sync to Firebase
      const newOrder = await createOrder({
        customer,
        address,
        items: orderItems,
        subtotal,
        discount: couponDiscount + pixDiscount,
        couponCode: activeCoupon?.code,
        freightOption: selectedFreight,
        freightPrice: selectedFreight.price,
        total,
        paymentMethod: 'INFINITEPAY',
        installments: paymentChoice === 'CREDIT_CARD' ? installments : undefined,
      });

      setCompletedOrder(newOrder);

      // Prepares items strictly in integer cents (e.g. R$ 100,00 = 10000)
      const totalInCents = toCents(total);
      const freightInCents = toCents(selectedFreight.price);
      const netProductsCents = Math.max(100, totalInCents - freightInCents);

      let infinitePayItems: InfinitePayItem[] = [];

      if (cart.length === 1) {
        infinitePayItems = [
          {
            quantity: cart[0].quantity,
            price: Math.max(1, Math.round(netProductsCents / cart[0].quantity)),
            description: cart[0].product.name.slice(0, 80),
          },
        ];
      } else {
        let runningSum = 0;
        infinitePayItems = cart.map((item, idx) => {
          const itemWeight = (item.product.price * item.quantity) / (subtotal || 1);
          if (idx === cart.length - 1) {
            const itemTotal = netProductsCents - runningSum;
            const unitPrice = Math.max(1, Math.round(itemTotal / item.quantity));
            return {
              quantity: item.quantity,
              price: unitPrice,
              description: item.product.name.slice(0, 80),
            };
          }
          const itemTotal = Math.round(netProductsCents * itemWeight);
          runningSum += itemTotal;
          const unitPrice = Math.max(1, Math.round(itemTotal / item.quantity));
          return {
            quantity: item.quantity,
            price: unitPrice,
            description: item.product.name.slice(0, 80),
          };
        });
      }

      if (freightInCents > 0) {
        infinitePayItems.push({
          quantity: 1,
          price: freightInCents,
          description: `Envio ${selectedFreight.name} (${selectedFreight.carrier})`,
        });
      }

      // Check sum of items and adjust 1 cent if rounding difference exists
      const currentSum = infinitePayItems.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const diff = totalInCents - currentSum;
      if (diff !== 0 && infinitePayItems.length > 0) {
        infinitePayItems[0].price += diff;
      }

      const redirectUrl = `${window.location.origin}/obrigado?nsu=${encodeURIComponent(orderNsu)}`;
      const webhookUrl = `${window.location.origin}/api/webhook-infinitepay`;

      // Request payment link to InfinitePay API
      const result = await createInfinitePayCheckoutLink({
        order_nsu: orderNsu,
        items: infinitePayItems,
        customer: {
          name: customer.name,
          email: customer.email,
          phone_number: customer.phone,
        },
        address: {
          cep: address.cep,
          street: address.street,
          number: address.number,
          neighborhood: address.neighborhood,
          complement: address.complement,
          city: address.city,
          state: address.state,
        },
        redirect_url: redirectUrl,
        webhook_url: webhookUrl,
      });

      if (result.success && result.url) {
        setCheckoutRedirectUrl(result.url);
        setIsRedirecting(true);
        clearCart();
        showToast('Link do Checkout InfinitePay gerado! Abrindo aba de pagamento...', 'success');

        // Open InfinitePay Checkout in a new tab
        window.open(result.url, '_blank');

        // Advance user to success / thank you state with payment check options
        setStep(4);
        window.scrollTo({ top: 0, behavior: 'smooth' });

        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {
          // Fallback
        }
      } else {
        throw new Error('Não foi possível obter a URL do checkout da InfinitePay.');
      }
    } catch (err: any) {
      console.error('Erro ao processar InfinitePay:', err);
      setErrorMessage(
        err?.message || 'Falha ao conectar com o Checkout da InfinitePay. Por favor, tente novamente.'
      );
      showToast('Erro ao iniciar pagamento InfinitePay.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenWhatsAppOrder = () => {
    if (!completedOrder) return;
    const cleanPhone = settings.whatsapp.replace(/\D/g, '');
    const encoded = encodeURIComponent(completedOrder.whatsappMessageText);
    window.open(`https://wa.me/55${cleanPhone}?text=${encoded}`, '_blank');
  };

  const copyPixCode = () => {
    const fakePixCopiaECola = `00020126580014br.gov.bcb.pix0136${settings.whatsapp.replace(/\D/g, '')}520400005303986540${total.toFixed(2)}5802BR5915WISBECK COMPANY6006ITAJAI62070503***6304`;
    navigator.clipboard.writeText(fakePixCopiaECola);
    setCopiedPix(true);
    showToast('Código PIX Copia e Cola copiado!', 'success');
    setTimeout(() => setCopiedPix(false), 3000);
  };

  if (cart.length === 0 && step !== 4) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Seu carrinho está vazio</h2>
        <p className="text-xs text-slate-500">Adicione produtos antes de ir para o checkout.</p>
        <button
          onClick={navigateToHome}
          className="px-5 py-2.5 bg-slate-900 text-white font-semibold rounded-lg text-xs"
        >
          Explorar Produtos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Checkout Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button
            onClick={navigateToHome}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar à Loja</span>
          </button>
          
          <div className="flex items-center gap-1.5 text-slate-600 text-xs font-medium">
            <Lock className="w-4 h-4 text-emerald-600" />
            <span>Checkout Seguro 256-bit SSL</span>
          </div>
        </div>

        {/* Stepper Progress */}
        <div className="grid grid-cols-4 gap-2 text-center text-xs">
          {[
            { num: 1, label: 'Identificação' },
            { num: 2, label: 'Entrega' },
            { num: 3, label: 'Pagamento' },
            { num: 4, label: 'Conclusão' },
          ].map((s) => (
            <div
              key={s.num}
              className={`p-2 rounded-lg border flex flex-col items-center gap-1 transition-colors ${
                step === s.num
                  ? 'bg-white border-orange-500 text-orange-600 font-bold shadow-xs'
                  : step > s.num
                  ? 'bg-slate-100 border-slate-300 text-slate-700 font-medium'
                  : 'bg-white border-slate-200 text-slate-400'
              }`}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border border-current">
                {step > s.num ? <Check className="w-3 h-3" /> : s.num}
              </div>
              <span className="hidden sm:inline text-[11px]">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Form and Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Left (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs">
            
            {/* STEP 1: IDENTIFICATION */}
            {step === 1 && (
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-950 font-heading">
                    1. Dados de Contato & Identificação
                  </h3>
                  <p className="text-xs text-slate-500">
                    Enviaremos o comprovante e código de rastreio Correios no seu WhatsApp.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Nome Completo *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Eduardo Silveira"
                      value={customer.name}
                      onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">WhatsApp / Celular *</label>
                      <input
                        type="tel"
                        required
                        placeholder="(47) 99999-9999"
                        value={customer.phone}
                        onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">CPF ou CNPJ</label>
                      <input
                        type="text"
                        placeholder="000.000.000-00"
                        value={customer.cpf}
                        onChange={(e) => setCustomer({ ...customer, cpf: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">E-mail para envio da Nota Fiscal *</label>
                    <input
                      type="email"
                      required
                      placeholder="seuemail@exemplo.com"
                      value={customer.email}
                      onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs transition-colors"
                >
                  Continuar para Entrega & Frete
                </button>
              </form>
            )}

            {/* STEP 2: ADDRESS & CORREIOS */}
            {step === 2 && (
              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div>
                  <h3 className="text-base font-bold text-slate-950 font-heading">
                    2. Endereço de Entrega & Modalidade Correios
                  </h3>
                  <p className="text-xs text-slate-500">
                    Digite seu CEP para buscar rua, bairro e calcular PAC/SEDEX.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">CEP *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="00000-000"
                        value={address.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                        maxLength={9}
                        className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                      />
                      {isFetchingCep && (
                        <Loader2 className="w-4 h-4 text-orange-600 absolute right-3 top-1/2 -translate-y-1/2 animate-spin" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-slate-700 font-semibold mb-1">Logradouro / Rua *</label>
                      <input
                        type="text"
                        required
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Número *</label>
                      <input
                        type="text"
                        required
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Bairro *</label>
                      <input
                        type="text"
                        required
                        value={address.neighborhood}
                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Cidade *</label>
                      <input
                        type="text"
                        required
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">UF *</label>
                      <input
                        type="text"
                        required
                        maxLength={2}
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                        className="w-full bg-slate-50 text-slate-900 p-2.5 rounded-lg border border-slate-300"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Complemento (opcional)</label>
                    <input
                      type="text"
                      placeholder="Apto, Sala, Bloco..."
                      value={address.complement}
                      onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                      className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 p-2.5 rounded-lg border border-slate-300"
                    />
                  </div>

                  {/* Freight Options Selection */}
                  <div className="pt-2 border-t border-slate-200 space-y-2">
                    <label className="block text-xs font-bold text-slate-900">
                      Escolha a Opção de Envio:
                    </label>

                    {freightOptions.length === 0 ? (
                      <div className="p-3 rounded-lg bg-slate-50 text-center text-slate-500 text-xs">
                        Digite seu CEP acima para carregar o cálculo dos Correios.
                      </div>
                    ) : (
                      freightOptions.map((opt) => (
                        <div
                          key={opt.code}
                          onClick={() => setSelectedFreight(opt)}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors flex items-center justify-between ${
                            selectedFreight?.code === opt.code
                              ? 'bg-orange-50/50 border-orange-500'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="freight"
                              checked={selectedFreight?.code === opt.code}
                              onChange={() => setSelectedFreight(opt)}
                              className="accent-orange-600"
                            />
                            <div>
                              <p className="font-semibold text-slate-900 text-xs">{opt.name}</p>
                              <p className="text-[11px] text-slate-500">{opt.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-xs ${opt.price === 0 ? 'text-emerald-700' : 'text-slate-900'}`}>
                              {opt.price === 0 ? 'GRÁTIS' : `R$ ${opt.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            </p>
                            <p className="text-[10px] text-slate-500">{opt.deadlineDays === 0 ? 'Retirada em 2h' : `${opt.deadlineDays} dias úteis`}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-1/3 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-lg text-xs hover:bg-slate-200"
                  >
                    Voltar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs"
                  >
                    Ir para Pagamento
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: PAYMENT - INFINITEPAY INTEGRATED CHECKOUT */}
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-950 font-heading flex items-center gap-2">
                      <span>3. Pagamento Seguro InfinitePay</span>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                        Oficial
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500">
                      Pague com Pix (com 10% OFF imediato) ou Cartão de crédito em até 12x via InfinitePay.
                    </p>
                  </div>
                  

                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-bold">Aviso no processamento do pagamento:</p>
                      <p className="text-[11px] text-rose-700 mt-0.5">{errorMessage}</p>
                    </div>
                  </div>
                )}

                {/* Payment Methods Selection Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* PIX Option */}
                  <div
                    onClick={() => setPaymentChoice('PIX')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      paymentChoice === 'PIX'
                        ? 'bg-emerald-50/70 border-emerald-500 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <QrCode className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Pix Instantâneo</p>
                          <p className="text-[11px] text-emerald-700 font-bold">10% de desconto à vista</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentChoice === 'PIX'}
                        onChange={() => setPaymentChoice('PIX')}
                        className="accent-emerald-600 mt-1"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 space-y-1">
                      <p className="font-medium text-emerald-950">
                        ✓ QR Code gerado automaticamente no checkout InfinitePay
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Aprovação em segundos e liberação imediata para expedição.
                      </p>
                    </div>
                  </div>

                  {/* Credit Card Option */}
                  <div
                    onClick={() => setPaymentChoice('CREDIT_CARD')}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex flex-col justify-between space-y-3 ${
                      paymentChoice === 'CREDIT_CARD'
                        ? 'bg-slate-50 border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0">
                          <CreditCard className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">Cartão de Crédito</p>
                          <p className="text-[11px] text-slate-500 font-medium">Em até 12x no cartão</p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentChoice === 'CREDIT_CARD'}
                        onChange={() => setPaymentChoice('CREDIT_CARD')}
                        className="accent-slate-900 mt-1"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-lg border border-slate-200/60 space-y-1">
                      <p className="font-medium text-slate-900">
                        ✓ Parcelamento em até 12x sem burocracia
                      </p>
                      <p className="text-[10px] text-slate-500">
                        Protegido pelo antifraude bancário e segurança InfinitePay.
                      </p>
                    </div>
                  </div>
                </div>

                {/* InfinitePay Trust & Security Info */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px]">
                      Você será redirecionado para o ambiente seguro oficial da <strong>InfinitePay</strong> para concluir o pagamento.
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 hidden sm:inline">
                    SSL 256-Bit
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    disabled={isSubmitting || isRedirecting}
                    className="w-1/3 py-3 bg-slate-100 text-slate-700 font-semibold rounded-xl text-xs hover:bg-slate-200 transition-colors"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || isRedirecting}
                    onClick={handleFinalizeOrder}
                    className="flex-1 py-3.5 px-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
                  >
                    {isSubmitting || isRedirecting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Gerando Link Seguro InfinitePay...</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Pagar com Pix ou Cartão via InfinitePay (R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4: SUCCESS & WHATSAPP */}
            {step === 4 && completedOrder && (
              <div className="space-y-5 text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center font-bold text-xl">
                  ✓
                </div>

                <div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded uppercase">
                    Pedido Registrado
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-950 mt-1 font-heading">
                    {completedOrder.code}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Obrigado, <strong className="text-slate-900">{completedOrder.customer.name}</strong>! Seu pedido foi gravado com sucesso.
                  </p>
                </div>

                {(completedOrder.paymentMethod === 'PIX' || completedOrder.paymentMethod === 'INFINITEPAY') && (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Pagamento via PIX (10% OFF aplicado)</span>
                      <span className="text-sm font-extrabold text-slate-950 font-heading">
                        R$ {completedOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="flex items-center justify-center p-3 bg-white rounded-lg max-w-[180px] mx-auto border border-slate-200">
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=WISBECK-COMPANY-PIX-ORDER"
                        alt="QR Code PIX"
                        className="w-32 h-32 object-contain"
                      />
                    </div>

                    <button
                      onClick={copyPixCode}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-white hover:bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5 text-orange-600" />
                      <span>{copiedPix ? 'CÓDIGO COPIADO!' : 'Copiar Código PIX Copia e Cola'}</span>
                    </button>
                  </div>
                )}

                {/* WhatsApp Action */}
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                  <p className="text-xs text-emerald-900 font-medium">
                    Envie os dados do seu pedido diretamente para nossa equipe técnica em Itajaí/SC para agilizar a separação e postagem Correios.
                  </p>
                  <button
                    onClick={handleOpenWhatsAppOrder}
                    className="w-full py-3 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>ENVIAR PEDIDO NO WHATSAPP DA LOJA</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={navigateToHome}
                    className="text-xs text-slate-600 hover:text-slate-900 font-medium underline"
                  >
                    Voltar para a Página Inicial
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* Summary Right (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2.5">
                Resumo do Pedido ({cart.reduce((a, b) => a + b.quantity, 0)} itens)
              </h3>

              <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto pr-1 space-y-2">
                {cart.map((item) => (
                  <div key={item.product.id} className="pt-2 flex items-center gap-2.5">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-11 h-11 rounded-md bg-slate-50 object-contain p-1 border border-slate-200 shrink-0"
                    />
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-slate-900 truncate">{item.product.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {item.quantity}x • R$ {item.product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-slate-900 shrink-0">
                      R$ {(item.product.price * item.quantity).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-slate-900">R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Cupom {activeCoupon?.code}</span>
                    <span>- R$ {couponDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Frete ({selectedFreight ? selectedFreight.name : 'A calcular'})</span>
                  <span className={freightPrice === 0 && selectedFreight ? 'text-emerald-700 font-bold' : 'text-slate-900'}>
                    {selectedFreight ? (freightPrice === 0 ? 'GRÁTIS' : `R$ ${freightPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`) : '--'}
                  </span>
                </div>

                {paymentChoice === 'PIX' && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Desconto PIX (10% OFF)</span>
                    <span>- R$ {pixDiscount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                )}

                <div className="border-t border-slate-200 pt-2 flex justify-between items-baseline">
                  <span className="font-bold text-slate-950 text-xs sm:text-sm">Total Estimado</span>
                  <span className="text-lg font-black text-slate-950 font-heading">
                    R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1">
              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Garantia Wisbeck Company</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Produtos novos lacrados, nota fiscal eletrônica e assistência técnica autorizada.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
