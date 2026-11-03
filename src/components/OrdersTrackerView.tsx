import React, { useState } from 'react';
import { Truck, Search, MapPin } from 'lucide-react';
import { useStore } from '../lib/store';
import { Order } from '../types';

export const OrdersTrackerView: React.FC = () => {
  const { orders } = useStore();
  const [searchInput, setSearchInput] = useState('');
  const [foundOrder, setFoundOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim().toUpperCase();
    const matched = orders.find(
      (o) =>
        o.code.toUpperCase() === query ||
        o.code.replace('#', '').toUpperCase() === query ||
        o.customer.email.toLowerCase() === searchInput.trim().toLowerCase()
    );
    setFoundOrder(matched || null);
    setHasSearched(true);
  };

  const steps = [
    { key: 'pending', title: 'Pedido Realizado' },
    { key: 'paid', title: 'Pagamento Confirmado' },
    { key: 'processing', title: 'Em Separação no Showroom' },
    { key: 'shipped', title: 'Despachado nos Correios' },
    { key: 'delivered', title: 'Entregue com Sucesso' },
  ];

  const getStepIndex = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 0;
      case 'paid': return 1;
      case 'processing': return 2;
      case 'shipped': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStepIdx = foundOrder ? getStepIndex(foundOrder.status) : 0;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 sm:py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-10 h-10 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center mx-auto mb-2">
            <Truck className="w-5 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-950 font-heading">
            Rastrear Pedido Correios
          </h1>
          <p className="text-xs text-slate-500">
            Acompanhe o andamento da sua compra na Wisbeck Company.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Digite o código (ex: #WB-9842) ou seu e-mail"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 px-3 py-2.5 rounded-lg border border-slate-300 focus:bg-white focus:border-slate-900 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Rastrear</span>
            </button>
          </form>

          <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-500">
            <span>Exemplos para testar:</span>
            <button
              type="button"
              onClick={() => {
                setSearchInput('#WB-9842');
                const matched = orders.find((o) => o.code === '#WB-9842');
                setFoundOrder(matched || null);
                setHasSearched(true);
              }}
              className="text-orange-600 hover:underline font-semibold"
            >
              #WB-9842
            </button>
            <span>ou</span>
            <button
              type="button"
              onClick={() => {
                setSearchInput('#WB-9841');
                const matched = orders.find((o) => o.code === '#WB-9841');
                setFoundOrder(matched || null);
                setHasSearched(true);
              }}
              className="text-orange-600 hover:underline font-semibold"
            >
              #WB-9841
            </button>
          </div>
        </div>

        {/* Order Details */}
        {foundOrder && (
          <div className="bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Pedido Identificado
                </span>
                <h3 className="text-lg font-bold text-slate-950 font-heading">{foundOrder.code}</h3>
                <p className="text-xs text-slate-600">Cliente: {foundOrder.customer.name}</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[11px] text-slate-500">Total do Pedido</p>
                <p className="text-base font-bold text-slate-950 font-heading">
                  R$ {foundOrder.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>

            {/* Tracking Code if Shipped */}
            {foundOrder.trackingCode && (
              <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <p className="text-[11px] text-blue-700 font-semibold uppercase tracking-wider">
                    Código de Rastreamento Correios
                  </p>
                  <p className="text-sm font-bold text-blue-950">{foundOrder.trackingCode}</p>
                </div>
                <a
                  href="https://rastreamento.correios.com.br/app/index.php"
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Abrir Correios
                </a>
              </div>
            )}

            {/* Timeline Stepper */}
            <div className="space-y-3 pt-1">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Evolução da Entrega
              </h4>
              <div className="relative pl-5 space-y-4 border-l-2 border-slate-200">
                {steps.map((st, idx) => {
                  const isDone = idx <= currentStepIdx;
                  const isCurrent = idx === currentStepIdx;
                  return (
                    <div key={st.key} className="relative">
                      <div
                        className={`absolute -left-[27px] top-0 w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                          isDone ? 'bg-orange-600 text-white' : 'bg-slate-200 text-slate-500'
                        }`}
                      >
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <div>
                        <p className={`text-xs font-semibold ${isCurrent ? 'text-orange-600 font-bold' : isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {st.title}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery address */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 flex items-start gap-2">
              <MapPin className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-900">Destino de Entrega:</p>
                <p>{foundOrder.address.street}, {foundOrder.address.number} - {foundOrder.address.neighborhood}</p>
                <p>{foundOrder.address.city}/{foundOrder.address.state} - CEP: {foundOrder.address.cep}</p>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !foundOrder && (
          <div className="p-6 text-center bg-white rounded-xl border border-slate-200 text-slate-500 text-xs space-y-1">
            <p className="font-semibold text-slate-800">Nenhum pedido localizado</p>
            <p>Verifique o código informado ou o e-mail cadastrado na compra.</p>
          </div>
        )}

      </div>
    </div>
  );
};
