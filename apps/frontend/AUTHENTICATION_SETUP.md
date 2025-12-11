# 🔐 Belezeiro Authentication System

Sistema completo de autenticação com Google OAuth integrado à API Belezeiro.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Configuração](#configuração)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Como Usar](#como-usar)
- [Personalizações](#personalizações)
- [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitetura

### Camadas Implementadas

```
┌─────────────────────────────────────────────────────────┐
│                     UI Components                       │
│  (Login, ProtectedRoute, PublicRoute)                  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Auth Context                          │
│  (Estado global de autenticação)                       │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                     Services                            │
│  • Auth Service (login, logout, me, refresh)           │
│  • Google OAuth Service (fetch user info)              │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   HTTP Clients                          │
│  • Public Client (sem credentials)                     │
│  • Private Client (com credentials - cookies)          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Interceptors                          │
│  • Auto refresh token quando expira                    │
│  • Error handling centralizado                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│               Data Validation (Zod)                     │
│  • Schemas para todas as requisições/respostas         │
│  • Type-safe em runtime                                │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 API Belezeiro                           │
│  https://api.belezeiro.com.br                          │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Autenticação

1. **Login:** Usuário clica em "Continuar com Google"
2. **OAuth:** Google popup abre e usuário autoriza
3. **Fetch User Info:** App busca dados do usuário no Google
4. **API Login:** Envia dados para `/auth/login` na API Belezeiro
5. **Tokens:** API retorna cookies httpOnly com access + refresh tokens
6. **Estado:** AuthContext salva dados do usuário
7. **Redirect:** Navega para dashboard/onboarding/etc conforme fluxo

---

## ⚙️ Configuração

### 1. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
cp .env.example .env
```

Edite o `.env` com suas credenciais:

```env
# API Configuration
VITE_API_URL=https://api.belezeiro.com.br

# Google OAuth Configuration
VITE_GOOGLE_CLIENT_ID=seu-client-id-aqui.apps.googleusercontent.com

# Environment
VITE_APP_ENV=development
```

### 2. Obter Google Client ID

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá em "APIs & Services" → "Credentials"
4. Clique em "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - Application type: **Web application**
   - Authorized JavaScript origins:
     - `http://localhost:8080` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - Authorized redirect URIs:
     - `http://localhost:8080`
     - `https://seu-dominio.com`
6. Copie o Client ID e cole no `.env`

### 3. Instalar Dependências

As dependências já foram instaladas, mas caso precise reinstalar:

```bash
npm install axios @react-oauth/google
```

---

## 📁 Estrutura de Arquivos

```
src/
├── components/
│   ├── ProtectedRoute.tsx          # Guard para rotas autenticadas
│   └── PublicRoute.tsx             # Guard para rotas públicas
│
├── contexts/
│   └── AuthContext.tsx             # Context de autenticação
│
├── services/
│   ├── api/
│   │   ├── client.ts               # Clientes HTTP (público/privado)
│   │   ├── interceptors.ts         # Interceptors (auto refresh)
│   │   └── auth.service.ts         # Serviços de auth (login, logout, etc)
│   └── oauth/
│       └── google.service.ts       # Google OAuth integration
│
├── types/
│   └── auth.types.ts               # Tipos TypeScript
│
├── schemas/
│   └── auth.schemas.ts             # Validação Zod
│
├── mappers/
│   └── auth.mappers.ts             # Data transformation
│
└── utils/
    └── error-handler.ts            # Tratamento de erros
```

---

## 🚀 Como Usar

### Proteger Rotas

Todas as rotas que requerem autenticação já estão protegidas no `App.tsx`:

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Rotas Públicas

Rotas como login que não devem ser acessadas por usuários autenticados:

```tsx
<Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
```

### Usar Auth Context em Componentes

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Não autenticado</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user.name}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### Fazer Requisições Autenticadas

Use o `privateClient` que automaticamente envia cookies:

```tsx
import { privateClient } from "@/services/api/client";

async function getAppointments() {
  const response = await privateClient.get("/appointments");
  return response.data;
}
```

### Hooks Disponíveis

```tsx
// Hook principal
const { user, isAuthenticated, isLoading, login, logout, checkAuth } = useAuth();

// Hook para pegar apenas o usuário
const user = useCurrentUser();

// Hook para verificar autenticação
const isAuthenticated = useIsAuthenticated();
```

---

## 🎨 Personalizações

### 1. Callback URL após Login

Edite a função `getCallbackUrl()` em `/src/pages/Login.tsx`:

```tsx
const getCallbackUrl = () => {
  // TODO: Implemente sua lógica personalizada aqui

  // Exemplo: redirecionar primeiro login para onboarding
  if (user.isFirstLogin) {
    return "/onboarding";
  }

  // Exemplo: verificar papel do usuário
  if (user.role === "admin") {
    return "/admin/dashboard";
  }

  // Padrão
  return "/dashboard";
};
```

### 2. Callback URL Dinâmico (Google Service)

Edite `/src/services/oauth/google.service.ts`:

```typescript
export function getCallbackUrl(user: { id: string; email: string }): string {
  // TODO: Implementar lógica de redirecionamento

  // Exemplos de critérios:
  // 1. Primeiro login
  // 2. Onboarding completo
  // 3. Papel do usuário
  // 4. URL de retorno da query string

  return "/dashboard"; // padrão
}
```

### 3. Adicionar Novos Endpoints

Crie novos métodos em `auth.service.ts`:

```typescript
// src/services/api/auth.service.ts
class AuthService {
  // ... métodos existentes

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await privateClient.put("/auth/profile", data);
    return response.data.user;
  }
}
```

### 4. Personalizar Tratamento de Erros

Edite `/src/utils/error-handler.ts` para adicionar códigos de erro customizados:

```typescript
export function handleApiError(error: unknown): ProcessedError {
  // ... código existente

  // Adicione seus códigos de erro customizados
  if (status === 403) {
    return {
      title: "Acesso Negado",
      message: "Você não tem permissão para acessar este recurso.",
    };
  }
}
```

---

## 🐛 Troubleshooting

### Erro: "Google OAuth não está configurado"

**Solução:** Verifique se `VITE_GOOGLE_CLIENT_ID` está configurado no `.env`

```bash
# Verificar variáveis de ambiente
echo $VITE_GOOGLE_CLIENT_ID
```

### Erro: 401 Unauthorized em todas as requisições

**Possíveis causas:**
1. Access token expirou e refresh falhou
2. Cookies não estão sendo enviados

**Solução:**
1. Verificar se `withCredentials: true` está configurado no `privateClient`
2. Verificar se a API está no mesmo domínio ou CORS está configurado
3. Limpar cookies e fazer login novamente

### Erro: "Failed to fetch user info from Google"

**Possíveis causas:**
1. Access token do Google inválido
2. Permissões insuficientes

**Solução:**
1. Verificar se o Client ID está correto
2. Verificar se as origens autorizadas estão configuradas no Google Console
3. Tentar fazer logout do Google e login novamente

### Refresh Token não funciona

**Verificar:**
1. Endpoint `/auth/refresh` está funcionando na API
2. Refresh token cookie está sendo enviado (`Path: /auth`)
3. Interceptor está configurado corretamente

**Debug:**
```typescript
// Em interceptors.ts, adicione logs:
console.log("[Interceptor] Attempting refresh...");
```

### Usuário não persiste após reload

**Causa:** O `checkAuth()` não está sendo chamado ou falha

**Solução:**
1. Verificar se `AuthProvider` está envolvendo as rotas
2. Verificar network tab se `/auth/me` está sendo chamado
3. Verificar se cookies persistem após reload

---

## 📚 Recursos Adicionais

### Documentação da API

Consulte o relatório completo da API em `AUTHENTICATION_SETUP.md`

### Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login com OAuth |
| POST | `/auth/refresh` | Renovar access token |
| POST | `/auth/logout` | Logout |
| GET | `/auth/me` | Dados do usuário atual |

### Tokens

- **Access Token:** Expira em 30 minutos
- **Refresh Token:** Expira em 30 dias
- **Ambos:** Armazenados em cookies httpOnly (seguro!)

### Segurança

✅ **Implementado:**
- Tokens em cookies httpOnly (protege contra XSS)
- SameSite cookies (protege contra CSRF)
- Refresh token rotation (detecta roubo de token)
- HTTPS em produção (via Secure flag)
- Validação com Zod em runtime
- TypeScript type safety

---

## 📝 Próximos Passos

1. ✅ Configurar variáveis de ambiente
2. ✅ Obter Google Client ID
3. ✅ Testar login local
4. 🔲 Customizar callback URL
5. 🔲 Implementar lógica de redirecionamento
6. 🔲 Adicionar outros provedores OAuth (Facebook, GitHub, etc)
7. 🔲 Implementar atualização de perfil
8. 🔲 Deploy em produção

---

**Desenvolvido com ❤️ para Belezeiro**
