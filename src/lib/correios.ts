import { Address, FreightOption } from '../types';

export const STORE_ORIGIN_CEP = '88307100'; // Rua José Gall, 650 - Itajaí/SC
export const STORE_ORIGIN_CITY = 'Itajaí';
export const STORE_ORIGIN_STATE = 'SC';

// Clean CEP helper
export function cleanCep(cep: string): string {
  return cep.replace(/\D/g, '');
}

// Format CEP helper (00000-000)
export function formatCep(cep: string): string {
  const cleaned = cleanCep(cep);
  if (cleaned.length <= 5) return cleaned;
  return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
}

// Fetch address via ViaCEP API
export async function fetchAddressByCep(cep: string): Promise<Partial<Address> | null> {
  const cleaned = cleanCep(cep);
  if (cleaned.length !== 8) return null;

  try {
    const res = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.erro) return null;

    return {
      cep: formatCep(cleaned),
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
    };
  } catch (error) {
    console.error('Erro ao consultar ViaCEP:', error);
    return null;
  }
}

// Calculate freight based on destination state, weight and subtotal
export function calculateCorreiosFreight(
  destinationState: string,
  totalWeightKg: number = 2.5,
  subtotal: number = 0,
  freeShippingThreshold: number = 599
): FreightOption[] {
  const uf = destinationState.toUpperCase().trim();
  const weight = Math.max(0.5, totalWeightKg);

  // Region zones relative to Santa Catarina (Itajaí/SC)
  let basePac = 28.90;
  let baseSedex = 42.50;
  let pacDays = 5;
  let sedexDays = 2;

  if (uf === 'SC') {
    // Santa Catarina (same state)
    basePac = 19.90;
    baseSedex = 28.50;
    pacDays = 3;
    sedexDays = 1;
  } else if (['PR', 'RS', 'SP'].includes(uf)) {
    // Sul and São Paulo
    basePac = 26.50;
    baseSedex = 38.90;
    pacDays = 4;
    sedexDays = 2;
  } else if (['RJ', 'MG', 'ES', 'MS', 'GO', 'DF'].includes(uf)) {
    // Sudeste e Centro-Oeste
    basePac = 34.00;
    baseSedex = 54.00;
    pacDays = 6;
    sedexDays = 3;
  } else if (['BA', 'PE', 'CE', 'RN', 'PB', 'AL', 'SE', 'PI', 'MA', 'MT'].includes(uf)) {
    // Nordeste e MT
    basePac = 46.00;
    baseSedex = 78.00;
    pacDays = 8;
    sedexDays = 4;
  } else {
    // Norte
    basePac = 58.00;
    baseSedex = 98.00;
    pacDays = 11;
    sedexDays = 5;
  }

  // Weight surcharge (above 1kg: R$ 4.50 per kg for PAC, R$ 7.50 for SEDEX)
  const extraWeight = Math.max(0, weight - 1);
  const pacPrice = Math.round((basePac + extraWeight * 4.5) * 100) / 100;
  const sedexPrice = Math.round((baseSedex + extraWeight * 7.5) * 100) / 100;

  // Free shipping on PAC if order value meets threshold
  const isFreePac = subtotal >= freeShippingThreshold;

  const options: FreightOption[] = [
    {
      code: 'PAC',
      name: 'Correios PAC',
      price: isFreePac ? 0 : pacPrice,
      deadlineDays: pacDays,
      carrier: 'Correios',
      description: isFreePac
        ? 'Frete Grátis com rastreamento oficial dos Correios'
        : 'Econômico com rastreamento oficial dos Correios',
    },
    {
      code: 'SEDEX',
      name: 'Correios SEDEX Express',
      price: sedexPrice,
      deadlineDays: sedexDays,
      carrier: 'Correios',
      description: 'Entrega rápida com prioridade máxima e seguro total',
    },
  ];

  // Option to pick up at Itajaí store
  options.push({
    code: 'RETIRADA',
    name: 'Retirar na Loja Wisbeck (Itajaí/SC)',
    price: 0,
    deadlineDays: 0,
    carrier: 'Wisbeck Company',
    description: 'Rua José Gall, 650 – Dom Bosco, Itajaí/SC. Disponível em 2h úteis.',
  });

  return options;
}
