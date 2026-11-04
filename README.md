# Wisbeck Company – Som Profissional & Instrumentos Musicais
> E-commerce completo, moderno, premium e altamente profissional desenvolvido com base na identidade visual corporativa da **Wisbeck Company**.

---

## 🎵 1. Identidade da Marca
- **Nome:** Wisbeck Company
- **Slogan:** Som Profissional | Instrumentos Musicais | Sonorização de Ambiente | Soluções para Igrejas
- **Endereço Físico:** Rua José Gall, nº 650 – Dom Bosco – Itajaí/SC – CEP 88307-100
- **Instagram:** [@wisbeckcompany](https://instagram.com/wisbeckcompany)
- **WhatsApp Oficial:** (47) 99284-8840
- **Logo Oficial:** `https://i.postimg.cc/7YZqgm6W/Logo-corporativo-WISBECK-com-gradiente-colorido.png`
- **Paleta de Cores:** Design Claro Editorial & Premium (fundo `#f8fafc` / `#ffffff`, tipografia Plus Jakarta Sans & Space Grotesk, contrastes elegantes `#0f172a`, gradiente de destaque Wisbeck laranja `#f97316` / âmbar `#f59e0b`).

---

## 🔒 2. Acesso à Área Administrativa (Admin)
- **Localização:** No centro do rodapé de qualquer página, há um link discreto **“Área Administrativa”** que direciona para `/admin`.
- **E-mail:** `admin@x.com`
- **Senha:** `admin4321`

### Funcionalidades do Painel Admin:
1. **Dashboard Completo:** Métricas em tempo real (Total de Vendas R$, Pedidos Realizados, Produtos em Estoque, Ticket Médio), gráfico de faturamento por categoria e tabela de pedidos recentes.
2. **Gestão de Categorias (CRUD Completo):** Criar, editar nome, ícone, descrição e remover categorias diretamente pelo painel administrativo, com atualização automática em toda a loja.
3. **Gestão de Produtos (CRUD Completo):** Cadastro, edição e remoção de produtos, controle de estoque, preço normal e PIX, marcas, seleção dinâmica de categorias cadastradas e tags especiais (*Mais Vendido*, *Especial Igrejas*, *Lançamento*).
4. **Gerador de Cupons:** Criação de cupons percentuais ou de valor fixo, prazo de validade, pedido mínimo e limite de utilização.
5. **Gestão de Pedidos:** Acompanhamento de pedidos, alteração de status (*Pendente, Pago, Em Separação, Enviado nos Correios, Entregue, Cancelado*), inserção de código de rastreamento dos Correios e link direto para chamar o cliente no WhatsApp com mensagem personalizada.
6. **CMS da Loja:** Edição do banner de anúncio superior, valor mínimo para frete grátis, porcentagem de desconto do PIX, horário de funcionamento e endereço do showroom.
7. **Controle de Redes Sociais & Contatos:** Edição do WhatsApp, Instagram, telefone e e-mail.
8. **Relatórios:** Exportação em 1 clique de relatórios completos de vendas e inventário de produtos em formato **CSV**.

---

## 📦 3. Integração com Correios & ViaCEP
- **Cálculo Automático por CEP:** O cliente digita o CEP na página do produto ou no checkout. O sistema consulta automaticamente a API do **ViaCEP** (`https://viacep.com.br/ws/${cep}/json/`) para preencher logradouro, bairro, cidade e estado.
- **Frete PAC & SEDEX:** A partir da origem da loja física em **Itajaí/SC (CEP 88307-100)**, o frete calcula automaticamente valor e prazo em dias úteis com base no peso e destino do cliente.
- **Frete Grátis:** Aplicado automaticamente para compras acima de R$ 599,00.
- **Retirada na Loja:** Opção gratuita de retirada no showroom de Itajaí/SC em 2h úteis.

---

## 🔥 4. Autoconfiguração do Firebase
O sistema vem pré-configurado e com fallback integrado (`firebase-applet-config.json`).
Você pode subir diretamente no Vercel que ele funcionará imediatamente! Caso queira usar suas próprias chaves no Vercel:

Adicione as variáveis de ambiente no painel da **Vercel** (`Settings` -> `Environment Variables`):
```env
VITE_FIREBASE_API_KEY="sua_api_key"
VITE_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu_projeto"
VITE_FIREBASE_STORAGE_BUCKET="seu_projeto.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
VITE_FIREBASE_APP_ID="seu_app_id"
VITE_FIREBASE_FIRESTORE_DATABASE_ID="(default)"
```

---

## 🚀 5. Como Subir e Colocar Online no Vercel (Sem Erros)

O projeto já conta com o arquivo `vercel.json` configurado com regras de rewrite para SPA (Single Page Application), garantindo que rotas como `/admin`, `/carrinho` ou links diretos nunca dêem erro 404 ao recarregar a página.

### Passo a Passo no Vercel:
1. Suba o código para o seu repositório no **GitHub** ou **GitLab**.
2. Acesse [vercel.com](https://vercel.com) e clique em **"Add New"** > **"Project"**.
3. Importe o seu repositório.
4. Na tela de configuração:
   - **Framework Preset:** Vite
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. (Opcional) Em **Environment Variables**, adicione as chaves do Firebase se desejar sobrepor as padrões.
6. Clique em **Deploy**.
7. Pronto! Seu site estará 100% online com certificado SSL gratuito, CDN global ultrarrápida e todas as rotas funcionando perfeitamente.
