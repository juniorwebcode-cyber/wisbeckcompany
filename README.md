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
- **Paleta de Cores:** Extraída 100% da logo oficial (laranja `#ff5722` → amarelo `#f59e0b` → vermelho `#ef4444` → roxo `#8b5cf6` → azul `#3b82f6`) sobre tons dark de fundo (`#0b0c12`, `#12131e`).

---

## 🔒 2. Acesso à Área Administrativa (Admin)
- **Localização:** No centro do rodapé de qualquer página, há um link discreto **“Área Administrativa”** que direciona para `/admin`.
- **E-mail:** `admin@x.com`
- **Senha:** `admin4321`

### Funcionalidades do Painel Admin:
1. **Dashboard Completo:** Métricas em tempo real (Total de Vendas R$, Pedidos Realizados, Produtos em Estoque, Ticket Médio), gráfico de vendas dos últimos 7 dias, gráfico de faturamento por categoria e tabela de pedidos recentes.
2. **Gestão de Produtos (CRUD Completo):** Cadastro, edição e remoção de produtos, controle de estoque, preço normal e PIX, marcas, categorias e tags especiais (*Mais Vendido*, *Especial Igrejas*, *Lançamento*).
3. **Upload de Fotos via Vercel Blob:** Suporte a upload de fotos com persistência na nuvem Vercel Blob e fallback instantâneo.
4. **Gerador de Cupons:** Criação de cupons percentuais ou de valor fixo, prazo de validade, pedido mínimo e limite de utilização.
5. **Gestão de Pedidos:** Acompanhamento de pedidos, alteração de status (*Pendente, Pago, Em Separação, Enviado nos Correios, Entregue, Cancelado*), inserção de código de rastreamento dos Correios e link direto para chamar o cliente no WhatsApp.
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

## 🔥 4. Configuração do Firebase
O sistema possui arquitetura **Zero-Config Dual-Mode**: funciona imediatamente com banco local sincronizado e conecta-se automaticamente ao seu projeto Firebase assim que as variáveis forem fornecidas.

### Passos para criar o projeto no Firebase:
1. Acesse o [Firebase Console](https://console.firebase.google.com/) e clique em **Adicionar projeto** (nome sugerido: `wisbeck-company`).
2. No menu lateral, acerte em **Firestore Database** → **Criar banco de dados** (escolha modo produção).
3. Em **Regras** (Rules), cole o conteúdo do arquivo `firestore.rules` fornecido no projeto.
4. Em **Authentication**, ative o provedor **E-mail/Senha**.
5. Crie o usuário administrador com o e-mail `admin@x.com` e a senha `admin4321`.
6. Em **Configurações do Projeto** (ícone da engrenagem), role até a seção **Seus aplicativos**, adicione um app Web e copie as credenciais para o seu `.env`:
```env
VITE_FIREBASE_API_KEY="sua_api_key"
VITE_FIREBASE_AUTH_DOMAIN="seu_projeto.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="seu_projeto"
VITE_FIREBASE_STORAGE_BUCKET="seu_projeto.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="seu_sender_id"
VITE_FIREBASE_APP_ID="seu_app_id"
```

---

## ☁️ 5. Configuração do Vercel Blob
1. No dashboard da [Vercel](https://vercel.com/), acesse seu projeto ou crie um novo.
2. Vá na aba **Storage** → **Create Database** → selecione **Blob**.
3. Escolha um nome (ex: `wisbeck-media`) e clique em **Create**.
4. A Vercel gerará o token `BLOB_READ_WRITE_TOKEN`. Adicione-o às variáveis de ambiente do projeto na Vercel ou no seu arquivo `.env`:
```env
BLOB_READ_WRITE_TOKEN="vercel_blob_rw_..."
```

---

## 🚀 6. Como Rodar Localmente e Fazer Deploy

### Executar Localmente:
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000`.

### Fazer Deploy no Vercel:
1. Conecte o repositório ao Vercel (`vercel` ou via GitHub).
2. Adicione as variáveis de ambiente descritas acima.
3. Comando de build: `npm run build`
4. Diretório de saída: `dist`
