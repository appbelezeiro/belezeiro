# Belezeiro API - Collection do Insomnia

Esta documentação contém a collection completa da API do Belezeiro para uso no Insomnia.

## 📦 Importando a Collection

1. Abra o Insomnia
2. Clique em `Application` > `Preferences` > `Data` > `Import Data`
3. Selecione o arquivo `insomnia-collection.json`
4. A collection "BELEZEIRO" será importada automaticamente

## 🔧 Configuração

### Variáveis de Ambiente

A collection já vem com um ambiente base configurado com as seguintes variáveis:

- **BASE_URL**: URL base da API (padrão: `http://localhost:3000`)
- **TOKEN**: Token de autenticação JWT (inicialmente vazio)

### Como Configurar o BASE_URL

1. No Insomnia, clique no dropdown de ambientes (canto superior esquerdo)
2. Selecione "Base Environment"
3. Clique em "Manage Environments"
4. Edite o valor de `BASE_URL` conforme necessário:
   - Desenvolvimento local: `http://localhost:3000`
   - Produção: `https://api.belezeiro.com`

### Como Configurar o TOKEN

Após fazer login usando o endpoint `POST /api/auth/social-login`:

1. Copie o token retornado na resposta
2. Vá em "Manage Environments"
3. Cole o token no campo `TOKEN`
4. Todos os endpoints que requerem autenticação usarão automaticamente esse token

## 📚 Estrutura da API

A collection está organizada nas seguintes categorias:

### 🏥 Health
- `GET /health` - Verifica o status da API

### 🔐 Auth (Autenticação)
- `POST /api/auth/social-login` - Login via provedores sociais
- `POST /api/auth/refresh` - Atualiza o token de acesso
- `POST /api/auth/logout` - Realiza logout
- `GET /api/auth/me` - Retorna dados do usuário autenticado (requer auth)

### 👥 Users (Usuários)
- `POST /api/users` - Cria um novo usuário

### 🏢 Organizations (Organizações)
- `POST /api/organizations` - Cria uma organização
- `GET /api/organizations/:id` - Busca organização por ID
- `GET /api/organizations/owner/:ownerId` - Busca organizações por proprietário
- `PUT /api/organizations/:id` - Atualiza organização

### 🏪 Units (Unidades)
- `POST /api/units` - Cria uma unidade
- `GET /api/units/active` - Lista unidades ativas
- `GET /api/units/:id` - Busca unidade por ID
- `GET /api/units/organization/:organizationId` - Lista unidades por organização
- `PUT /api/units/:id` - Atualiza unidade

### 📅 Bookings (Agendamentos)

#### Booking Rules (Regras)
- `POST /api/booking/rules` - Cria regra de agendamento
- `GET /api/booking/rules` - Lista regras
- `PUT /api/booking/rules/:id` - Atualiza regra
- `DELETE /api/booking/rules/:id` - Remove regra

#### Booking Exceptions (Exceções)
- `POST /api/booking/exceptions` - Cria exceção (feriados, etc)
- `GET /api/booking/exceptions` - Lista exceções
- `PUT /api/booking/exceptions/:id` - Atualiza exceção
- `DELETE /api/booking/exceptions/:id` - Remove exceção

#### Availability (Disponibilidade)
- `GET /api/booking/available-days` - Lista dias disponíveis
- `GET /api/booking/available-slots` - Lista horários disponíveis

#### Booking Management (Gerenciamento)
- `POST /api/booking` - Cria agendamento
- `POST /api/booking/:id/cancel` - Cancela agendamento

### 💰 Billing (Faturamento)

#### Plans (Planos)
- `GET /api/plans` - Lista planos ativos
- `GET /api/plans/:id` - Busca plano por ID

#### Subscriptions (Assinaturas)
- `POST /api/subscriptions/checkout` - Cria checkout
- `GET /api/subscriptions/unit/:unit_id` - Busca assinatura por unidade
- `POST /api/subscriptions/:id/cancel` - Cancela assinatura

#### Discounts (Descontos)
- `GET /api/discounts/validate/:code` - Valida código de desconto

#### Webhooks
- `POST /api/webhooks/payment-provider` - Webhook do provedor de pagamento

## 🚀 Como Usar

### 1. Testar a API
```bash
# Inicie o servidor local
npm run dev
```

### 2. Fazer Login
1. Use o endpoint `POST /api/auth/social-login`
2. Copie o token retornado
3. Configure a variável `TOKEN` no ambiente

### 3. Testar Endpoints Autenticados
- Todos os endpoints marcados com autenticação usarão automaticamente o token configurado
- Os endpoints públicos não requerem token

## 📝 Notas

- Substitua os valores placeholder (como `unit_id_here`, `org_id_here`) pelos IDs reais dos seus recursos
- Os exemplos de body nos requests são apenas ilustrativos - ajuste conforme necessário
- Alguns endpoints podem retornar erros se os dados relacionados não existirem

## 🔗 Links Úteis

- [Documentação da API](../README.md)
- [Insomnia Download](https://insomnia.rest/download)
