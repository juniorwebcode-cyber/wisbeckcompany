import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// InfinitePay Credentials
const INFINITEPAY_HANDLE = process.env.INFINITEPAY_HANDLE || 'wisbeckeletrosom';
const INFINITEPAY_API_KEY = process.env.INFINITEPAY_API_KEY || 'inchk_tZohPKIlvQlaiianuP9drL_Fhc_BetCw7qM9N1hiB3M';

const PRIMARY_CHECKOUT_ENDPOINT = 'https://api.checkout.infinitepay.io/links';
const LEGACY_CHECKOUT_ENDPOINT = 'https://api.infinitepay.io/invoices/public/checkout/links';
const PAYMENT_CHECK_ENDPOINT = 'https://api.checkout.infinitepay.io/payment_check';

// In-memory record of verified webhook transactions
const webhookOrdersLog = new Map<string, any>();

app.use(express.json());

// CORS & Preflight handling
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, x-api-key');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

/**
 * POST /api/create-infinitepay-link
 * Creates a secure checkout link with InfinitePay
 */
app.post('/api/create-infinitepay-link', async (req, res) => {
  try {
    const { order_nsu, items, customer, address, redirect_url, webhook_url } = req.body;

    if (!order_nsu || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Campos obrigatórios ausentes: order_nsu e items são necessários.',
      });
    }

    const host = req.get('host') || 'www.wisbeckcompany.com.br';
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    const defaultSite = `${protocol}://${host}`;

    const effectiveRedirectUrl = redirect_url || `${defaultSite}/obrigado?nsu=${encodeURIComponent(order_nsu)}`;
    const effectiveWebhookUrl = webhook_url || `${defaultSite}/api/webhook-infinitepay`;

    // Ensure prices are integers in cents
    const formattedItems = items.map((it: any) => ({
      quantity: Math.max(1, Number(it.quantity) || 1),
      price: Math.max(1, Math.round(Number(it.price))),
      description: String(it.description || 'Produto Wisbeck Company').slice(0, 100),
    }));

    const payload: any = {
      handle: INFINITEPAY_HANDLE,
      order_nsu,
      redirect_url: effectiveRedirectUrl,
      webhook_url: effectiveWebhookUrl,
      items: formattedItems,
    };

    if (customer?.name) {
      const rawPhone = customer.phone_number || customer.phone || '47996288524';
      const cleanDigits = rawPhone.replace(/\D/g, '');
      const formattedPhone = cleanDigits.length >= 10 ? `+55${cleanDigits.slice(-11)}` : '+5547996288524';

      payload.customer = {
        name: customer.name,
        email: customer.email || 'cliente@wisbeckcompany.com.br',
        phone_number: formattedPhone,
      };
    }

    if (address?.cep) {
      payload.address = {
        cep: String(address.cep).replace(/\D/g, ''),
        street: address.street || '',
        number: address.number || 'S/N',
        neighborhood: address.neighborhood || '',
        complement: address.complement || '',
      };
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${INFINITEPAY_API_KEY}`,
      'x-api-key': INFINITEPAY_API_KEY,
    };

    // 1. Try primary endpoint
    let apiResponse = await fetch(PRIMARY_CHECKOUT_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    let data: any = null;

    if (apiResponse.ok) {
      data = await apiResponse.json();
    } else {
      console.warn(`[InfinitePay] Primary endpoint status ${apiResponse.status}. Attempting legacy endpoint...`);
      // 2. Try legacy endpoint
      const legacyRes = await fetch(LEGACY_CHECKOUT_ENDPOINT, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (legacyRes.ok) {
        data = await legacyRes.json();
      } else {
        const errorText = await legacyRes.text();
        console.error('[InfinitePay] Both endpoints failed:', errorText);
        return res.status(legacyRes.status || 500).json({
          error: 'Falha ao gerar link de pagamento na InfinitePay.',
          details: errorText,
        });
      }
    }

    const checkoutUrl = data.url || data.link || data.checkout_url || (data.data && data.data.url);

    if (!checkoutUrl) {
      return res.status(502).json({
        error: 'Resposta da InfinitePay não continha URL de checkout.',
        response: data,
      });
    }

    return res.json({
      success: true,
      url: checkoutUrl,
      order_nsu,
      redirect_url: effectiveRedirectUrl,
      webhook_url: effectiveWebhookUrl,
    });
  } catch (error: any) {
    console.error('[InfinitePay] Exception creating link:', error);
    return res.status(500).json({
      error: 'Erro interno no servidor ao processar link de pagamento.',
      message: error?.message,
    });
  }
});

/**
 * POST /api/payment-check
 * Verifies payment status with InfinitePay
 */
app.post('/api/payment-check', async (req, res) => {
  try {
    const { order_nsu } = req.body;

    if (!order_nsu) {
      return res.status(400).json({ error: 'order_nsu é obrigatório' });
    }

    // Check if we already received a webhook for this NSU
    if (webhookOrdersLog.has(order_nsu)) {
      const logged = webhookOrdersLog.get(order_nsu);
      return res.json({
        paid: logged.status === 'paid' || logged.status === 'approved',
        status: logged.status,
        order_nsu,
        source: 'webhook_cache',
        data: logged,
      });
    }

    const payload = {
      handle: INFINITEPAY_HANDLE,
      order_nsu,
    };

    const apiRes = await fetch(PAYMENT_CHECK_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INFINITEPAY_API_KEY}`,
        'x-api-key': INFINITEPAY_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      const status = (data.status || data.payment_status || (data.paid ? 'paid' : 'pending')).toLowerCase();
      const isPaid = status === 'paid' || status === 'approved' || status === 'completed' || data.paid === true;

      return res.json({
        paid: isPaid,
        status: isPaid ? 'paid' : status,
        order_nsu,
        amount: data.amount ? data.amount / 100 : undefined,
        paymentMethod: data.payment_method || data.method,
        paidAt: data.paid_at || data.updated_at,
        raw: data,
      });
    }

    return res.status(apiRes.status).json({
      paid: false,
      status: 'pending',
      order_nsu,
    });
  } catch (error: any) {
    console.error('[InfinitePay] Exception checking payment:', error);
    return res.status(500).json({ error: 'Erro ao verificar pagamento', message: error?.message });
  }
});

/**
 * POST /api/webhook-infinitepay
 * Receives payment status updates from InfinitePay
 */
app.post('/api/webhook-infinitepay', async (req, res) => {
  try {
    const event = req.body;
    console.log('[InfinitePay Webhook] Received event:', JSON.stringify(event));

    const orderNsu = event.order_nsu || event.data?.order_nsu || event.orderId || event.data?.orderId;
    const status = (event.status || event.data?.status || (event.paid ? 'paid' : 'pending')).toLowerCase();

    if (orderNsu) {
      webhookOrdersLog.set(orderNsu, {
        order_nsu: orderNsu,
        status,
        receivedAt: new Date().toISOString(),
        payload: event,
      });
      console.log(`[InfinitePay Webhook] Successfully mapped order ${orderNsu} to status: ${status}`);
    }

    // Always respond 200 OK so InfinitePay knows the webhook was delivered
    return res.status(200).json({
      received: true,
      order_nsu: orderNsu,
      status: 'processed',
    });
  } catch (error: any) {
    console.error('[InfinitePay Webhook] Error processing webhook:', error);
    return res.status(200).json({ received: true, error: error?.message });
  }
});

/**
 * GET /api/webhook-infinitepay
 * Health check endpoint
 */
app.get('/api/webhook-infinitepay', (req, res) => {
  res.json({
    status: 'online',
    service: 'Wisbeck Company - InfinitePay Webhook Handler',
    handle: INFINITEPAY_HANDLE,
    timestamp: new Date().toISOString(),
  });
});

// Setup Vite or static serving based on environment
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Wisbeck Company running at http://0.0.0.0:${PORT}`);
    console.log(`[InfinitePay] Integrated with handle: ${INFINITEPAY_HANDLE}`);
  });
}

start();
