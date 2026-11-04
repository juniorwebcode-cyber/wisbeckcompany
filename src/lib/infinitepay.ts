// InfinitePay Integrated Checkout Service for Wisbeck Company
// Handle: wisbeckeletrosom
// Official Docs: https://api.checkout.infinitepay.io

export const INFINITEPAY_HANDLE = 'wisbeckeletrosom';
export const INFINITEPAY_API_KEY = 'inchk_tZohPKIlvQlaiianuP9drL_Fhc_BetCw7qM9N1hiB3M';
export const DEFAULT_SITE_URL = 'https://www.wisbeckcompany.com.br';

export const PRIMARY_CHECKOUT_ENDPOINT = 'https://api.checkout.infinitepay.io/links';
export const LEGACY_CHECKOUT_ENDPOINT = 'https://api.infinitepay.io/invoices/public/checkout/links';
export const PAYMENT_CHECK_ENDPOINT = 'https://api.checkout.infinitepay.io/payment_check';

export interface InfinitePayItem {
  quantity: number;
  price: number; // in cents (e.g. R$ 100,00 = 10000)
  description: string;
}

export interface InfinitePayCustomer {
  name: string;
  email: string;
  phone_number: string;
}

export interface InfinitePayAddress {
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  complement?: string;
  city?: string;
  state?: string;
}

export interface InfinitePayLinkRequest {
  order_nsu: string;
  items: InfinitePayItem[];
  customer?: InfinitePayCustomer;
  address?: InfinitePayAddress;
  redirect_url?: string;
  webhook_url?: string;
}

export interface InfinitePayLinkResponse {
  success: boolean;
  url: string;
  order_nsu: string;
  rawResponse?: any;
}

export interface InfinitePayPaymentCheckResult {
  paid: boolean;
  status: string;
  order_nsu: string;
  amount?: number;
  paymentMethod?: string;
  paidAt?: string;
  raw?: any;
}

/**
 * Converts a floating-point BRL value to integer cents.
 * e.g., 2499.90 -> 249990
 */
export function toCents(reais: number): number {
  return Math.round(Number(reais || 0) * 100);
}

/**
 * Cleans phone number to numeric digits with DDD
 */
export function cleanPhoneNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (!digits) return '+5547996288524';
  if (digits.startsWith('55') && digits.length >= 12) {
    return `+${digits}`;
  }
  if (digits.length >= 10) {
    return `+55${digits.slice(-11)}`;
  }
  return '+5547996288524';
}

/**
 * Creates an InfinitePay Checkout payment link.
 * Tries server-side proxy `/api/create-infinitepay-link` first (best security),
 * then falls back to direct API call if running in a client-only environment.
 */
export async function createInfinitePayCheckoutLink(
  request: InfinitePayLinkRequest
): Promise<InfinitePayLinkResponse> {
  const siteOrigin = typeof window !== 'undefined' && window.location.origin 
    ? window.location.origin 
    : DEFAULT_SITE_URL;

  const redirect_url = request.redirect_url || `${siteOrigin}/obrigado?nsu=${encodeURIComponent(request.order_nsu)}`;
  const webhook_url = request.webhook_url || `${siteOrigin}/api/webhook-infinitepay`;

  // 1. Try server-side proxy endpoint first
  try {
    const proxyRes = await fetch('/api/create-infinitepay-link', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        redirect_url,
        webhook_url,
      }),
    });

    if (proxyRes.ok) {
      const data = await proxyRes.json();
      const checkoutUrl = data.url || data.link || data.checkout_url || (data.data && data.data.url);
      if (checkoutUrl) {
        return {
          success: true,
          url: checkoutUrl,
          order_nsu: request.order_nsu,
          rawResponse: data,
        };
      }
    }
  } catch (proxyError) {
    console.warn('Backend proxy /api/create-infinitepay-link not available, falling back to direct API:', proxyError);
  }

  // 2. Direct API call to InfinitePay Primary Endpoint
  const payload = {
    handle: INFINITEPAY_HANDLE,
    order_nsu: request.order_nsu,
    redirect_url,
    webhook_url,
    items: request.items.map((item) => ({
      quantity: Math.max(1, Number(item.quantity) || 1),
      price: Math.max(1, Math.round(Number(item.price))),
      description: (item.description || 'Produto Wisbeck Company').slice(0, 100),
    })),
    ...(request.customer?.name ? {
      customer: {
        name: request.customer.name,
        email: request.customer.email,
        phone_number: cleanPhoneNumber(request.customer.phone_number),
      }
    } : {}),
    ...(request.address?.cep ? {
      address: {
        cep: (request.address.cep || '').replace(/\D/g, ''),
        street: request.address.street || '',
        number: request.address.number || 'S/N',
        neighborhood: request.address.neighborhood || '',
        complement: request.address.complement || '',
      }
    } : {}),
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${INFINITEPAY_API_KEY}`,
    'x-api-key': INFINITEPAY_API_KEY,
  };

  // Try primary endpoint
  try {
    const response = await fetch(PRIMARY_CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      const checkoutUrl = data.url || data.link || data.checkout_url || (data.data && data.data.url);
      if (checkoutUrl) {
        return {
          success: true,
          url: checkoutUrl,
          order_nsu: request.order_nsu,
          rawResponse: data,
        };
      }
    }
    console.warn(`Primary endpoint ${PRIMARY_CHECKOUT_ENDPOINT} responded with ${response.status}. Trying legacy endpoint...`);
  } catch (primaryErr) {
    console.warn('Primary endpoint request failed. Trying legacy endpoint...', primaryErr);
  }

  // Try legacy fallback endpoint
  try {
    const legacyResponse = await fetch(LEGACY_CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    if (legacyResponse.ok) {
      const data = await legacyResponse.json();
      const checkoutUrl = data.url || data.link || data.checkout_url || (data.data && data.data.url);
      if (checkoutUrl) {
        return {
          success: true,
          url: checkoutUrl,
          order_nsu: request.order_nsu,
          rawResponse: data,
        };
      }
    }
    const errText = await legacyResponse.text();
    throw new Error(`InfinitePay API error (${legacyResponse.status}): ${errText}`);
  } catch (legacyErr: any) {
    console.error('All InfinitePay endpoints failed:', legacyErr);
    throw new Error(legacyErr?.message || 'Falha ao conectar com o Checkout InfinitePay.');
  }
}

/**
 * Checks payment status for an order via InfinitePay payment_check endpoint.
 */
export async function checkInfinitePayPaymentStatus(
  order_nsu: string
): Promise<InfinitePayPaymentCheckResult> {
  const payload = {
    handle: INFINITEPAY_HANDLE,
    order_nsu,
  };

  // 1. Try server-side proxy
  try {
    const proxyRes = await fetch('/api/payment-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (proxyRes.ok) {
      const data = await proxyRes.json();
      return parsePaymentCheckResponse(data, order_nsu);
    }
  } catch (e) {
    // Continue to direct call
  }

  // 2. Direct API call
  try {
    const response = await fetch(PAYMENT_CHECK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INFINITEPAY_API_KEY}`,
        'x-api-key': INFINITEPAY_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      const data = await response.json();
      return parsePaymentCheckResponse(data, order_nsu);
    }
  } catch (err) {
    console.error('Erro ao verificar pagamento na InfinitePay:', err);
  }

  return {
    paid: false,
    status: 'pending',
    order_nsu,
  };
}

function parsePaymentCheckResponse(data: any, order_nsu: string): InfinitePayPaymentCheckResult {
  const status = (data.status || data.payment_status || (data.paid ? 'paid' : 'pending')).toLowerCase();
  const isPaid = status === 'paid' || status === 'approved' || status === 'completed' || data.paid === true;

  return {
    paid: isPaid,
    status: isPaid ? 'paid' : status,
    order_nsu,
    amount: data.amount ? data.amount / 100 : undefined,
    paymentMethod: data.payment_method || data.method,
    paidAt: data.paid_at || data.updated_at,
    raw: data,
  };
}
