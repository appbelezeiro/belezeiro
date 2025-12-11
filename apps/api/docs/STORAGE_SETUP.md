# 📦 Storage Setup - Cloudflare R2 & AWS S3

Guia completo para configurar upload de arquivos usando Cloudflare R2 ou AWS S3.

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Cloudflare R2 Setup](#cloudflare-r2-setup) ⭐ **Recomendado**
3. [AWS S3 Setup](#aws-s3-setup)
4. [Variáveis de Ambiente](#variáveis-de-ambiente)
5. [Testes](#testes)
6. [Troubleshooting](#troubleshooting)

---

## Visão Geral

Este projeto suporta dois provedores de armazenamento:

| Provider | Custo | Performance | Facilidade |
|----------|-------|-------------|------------|
| **Cloudflare R2** | ✅ **$0.015/GB** (sem egress) | ⚡ Muito boa | ⭐⭐⭐⭐⭐ |
| **AWS S3** | 💰 $0.023/GB + egress | ⚡⚡ Excelente | ⭐⭐⭐ |

### Por que Cloudflare R2?

- **Sem custos de egress (saída)** - Economia significativa
- **Compatível com S3 API** - Mesma SDK, fácil migração
- **CDN integrado** - URLs públicas rápidas
- **Preço previsível** - Apenas armazenamento e operações
- **Global** - Replicação automática

---

## Cloudflare R2 Setup

### Passo 1: Criar conta Cloudflare

1. Acesse [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Faça login ou crie uma conta gratuita
3. Navegue para **R2** no menu lateral

### Passo 2: Criar Bucket R2

1. No painel R2, clique em **"Create bucket"**
2. Configure:
   - **Bucket Name**: `belezeiro-uploads` (ou outro nome único)
   - **Location**: `Automatic` (recomendado) ou escolha região específica
3. Clique em **"Create bucket"**

![R2 Bucket Creation](https://imagedelivery.net/...)

### Passo 3: Configurar CORS

O CORS é necessário para permitir uploads diretos do browser.

1. No bucket criado, vá para **Settings** → **CORS Policy**
2. Adicione a seguinte política:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://belezeiro.com.br",
      "https://app.belezeiro.com.br"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

3. Clique em **"Save"**

> **Importante:** Substitua os domínios pelos seus domínios de produção!

### Passo 4: Gerar API Token (R2)

1. No painel R2, vá para **"Manage R2 API Tokens"**
2. Clique em **"Create API Token"**
3. Configure:
   - **Token Name**: `belezeiro-api-production`
   - **Permissions**:
     - ✅ Object Read & Write
     - ✅ (opcional) Admin Read & Write - se quiser gerenciar buckets via API
   - **TTL**: Nunca (ou defina período de expiração)
   - **Bucket**: Selecione `belezeiro-uploads` ou "All buckets"
4. Clique em **"Create API Token"**

5. **IMPORTANTE:** Copie e salve:
   - ✅ **Access Key ID** (ex: `abc123def456...`)
   - ✅ **Secret Access Key** (ex: `XYZ789...`) - **Só aparece uma vez!**
   - ✅ **Account ID** (ex: `1234567890abcdef...`)

### Passo 5: Obter URL Pública (Opcional)

Para servir arquivos publicamente:

#### Opção A: R2.dev Subdomain (Simples)

1. No bucket, vá para **Settings** → **Public Access**
2. Clique em **"Allow Access"**
3. Copie a URL pública: `https://pub-xxxxxxxx.r2.dev`

**Prós:** Gratuito e imediato
**Contras:** URL não customizável

#### Opção B: Custom Domain com Cloudflare (Recomendado)

1. No bucket, vá para **Settings** → **Custom Domains**
2. Clique em **"Connect Domain"**
3. Digite: `cdn.belezeiro.com.br` (ou outro subdomínio)
4. Cloudflare criará automaticamente o DNS record
5. Aguarde propagação (~5 minutos)

**Prós:** URL profissional, HTTPS automático, cache na edge
**Contras:** Requer domínio na Cloudflare

### Passo 6: Configurar Variáveis de Ambiente

Copie o `.env.example` e configure:

```bash
# Storage Provider
STORAGE_PROVIDER=r2

# Cloudflare R2
CLOUDFLARE_ACCOUNT_ID=1234567890abcdef...
CLOUDFLARE_ACCESS_KEY_ID=abc123def456...
CLOUDFLARE_SECRET_ACCESS_KEY=XYZ789...
R2_BUCKET=belezeiro-uploads

# URL Pública (escolha uma das opções)
# Opção A: R2.dev subdomain
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev

# Opção B: Custom domain
# R2_PUBLIC_URL=https://cdn.belezeiro.com.br
```

### Passo 7: Testar Integração

```bash
# 1. Reinicie a API
cd apps/api
pnpm dev

# 2. Teste o endpoint de upload
curl -X POST http://localhost:3000/api/upload/generate-url \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "profile",
    "file_name": "test.jpg",
    "content_type": "image/jpeg"
  }'

# Resposta esperada:
# {
#   "upload_url": "https://belezeiro-uploads.xxxx.r2.cloudflarestorage.com/...",
#   "key": "profile/usr_123/1234567890_abc123.jpg",
#   "expires_at": "2024-01-15T10:45:00.000Z"
# }
```

✅ **Sucesso!** Se você recebeu a resposta acima, a integração está funcionando!

---

## AWS S3 Setup

### Passo 1: Criar conta AWS

1. Acesse [AWS Console](https://console.aws.amazon.com/)
2. Faça login ou crie uma conta (requer cartão de crédito)

### Passo 2: Criar Bucket S3

1. No console AWS, vá para **S3**
2. Clique em **"Create bucket"**
3. Configure:
   - **Bucket Name**: `belezeiro-uploads` (globalmente único)
   - **Region**: `us-east-1` (ou região mais próxima do Brasil: `sa-east-1`)
   - **Block Public Access**: ✅ Mantenha bloqueado (usaremos pre-signed URLs)
   - **Versioning**: ❌ Desabilitado (opcional)
4. Clique em **"Create bucket"**

### Passo 3: Configurar CORS (S3)

1. No bucket criado, vá para **Permissions** → **CORS**
2. Cole a configuração:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
    "AllowedOrigins": [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://belezeiro.com.br",
      "https://app.belezeiro.com.br"
    ],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3600
  }
]
```

3. Clique em **"Save changes"**

### Passo 4: Criar IAM User com Permissões

1. Vá para **IAM** → **Users** → **Add users**
2. Nome: `belezeiro-s3-uploader`
3. Access type: **Access key - Programmatic access**
4. Permissions: **Attach existing policies directly**
5. Selecione: `AmazonS3FullAccess` (ou crie política customizada abaixo)

#### Política S3 Customizada (Mais Segura):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::belezeiro-uploads",
        "arn:aws:s3:::belezeiro-uploads/*"
      ]
    }
  ]
}
```

6. Finalize e **copie as credenciais**:
   - ✅ **Access Key ID**
   - ✅ **Secret Access Key**

### Passo 5: Configurar CloudFront (CDN - Opcional)

Para melhor performance e URLs customizáveis:

1. Vá para **CloudFront** → **Create Distribution**
2. Origin Domain: Selecione seu bucket S3
3. Origin Access: **Origin Access Control (OAC)** - Recomendado
4. Configure:
   - **Viewer Protocol Policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP Methods**: GET, HEAD, OPTIONS, PUT, POST, DELETE, PATCH
   - **Cache Policy**: CachingOptimized (ou customize)
5. **Alternate Domain Names (CNAME)**: `cdn.belezeiro.com.br`
6. **SSL Certificate**: Request certificate no ACM ou use default
7. Clique em **"Create Distribution"**
8. Copie o **Distribution Domain Name**: `d1234567890.cloudfront.net`

### Passo 6: Configurar Variáveis de Ambiente (S3)

```bash
# Storage Provider
STORAGE_PROVIDER=s3

# AWS S3
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
AWS_S3_BUCKET=belezeiro-uploads

# CloudFront (opcional)
AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net
# ou custom domain:
# AWS_CLOUDFRONT_URL=https://cdn.belezeiro.com.br
```

### Passo 7: Testar S3

```bash
# Mesmo teste do R2
curl -X POST http://localhost:3000/api/upload/generate-url \
  -H "Cookie: session_token=YOUR_SESSION_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "profile",
    "file_name": "test.jpg",
    "content_type": "image/jpeg"
  }'
```

---

## Variáveis de Ambiente

### Arquivo `.env` Completo

```bash
# ==================================
# STORAGE CONFIGURATION
# ==================================

# Provider: 's3', 'r2', ou 'fake'
STORAGE_PROVIDER=r2

# ----------------------------------
# Cloudflare R2 (se STORAGE_PROVIDER=r2)
# ----------------------------------
CLOUDFLARE_ACCOUNT_ID=your_account_id_here
CLOUDFLARE_ACCESS_KEY_ID=your_access_key_id_here
CLOUDFLARE_SECRET_ACCESS_KEY=your_secret_access_key_here
R2_BUCKET=belezeiro-uploads
R2_PUBLIC_URL=https://pub-xxxxxxxx.r2.dev

# ----------------------------------
# AWS S3 (se STORAGE_PROVIDER=s3)
# ----------------------------------
# AWS_REGION=us-east-1
# AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
# AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
# AWS_S3_BUCKET=belezeiro-uploads
# AWS_CLOUDFRONT_URL=https://d1234567890.cloudfront.net

# ----------------------------------
# Fake Storage (desenvolvimento)
# ----------------------------------
# STORAGE_PROVIDER=fake
# (Não precisa de credenciais)
```

### Ambientes Diferentes

#### Desenvolvimento Local
```bash
STORAGE_PROVIDER=fake
```

#### Staging/Homologação
```bash
STORAGE_PROVIDER=r2
CLOUDFLARE_ACCOUNT_ID=...
# usar bucket separado: belezeiro-uploads-staging
```

#### Produção
```bash
NODE_ENV=production
STORAGE_PROVIDER=r2
CLOUDFLARE_ACCOUNT_ID=...
R2_BUCKET=belezeiro-uploads
R2_PUBLIC_URL=https://cdn.belezeiro.com.br
```

---

## Testes

### Teste Manual via Frontend

1. **Inicie a aplicação:**
   ```bash
   # Terminal 1 - API
   cd apps/api
   pnpm dev

   # Terminal 2 - Frontend
   cd apps/frontend
   pnpm dev
   ```

2. **Acesse a aplicação:** `http://localhost:5173`

3. **Teste upload de foto de perfil:**
   - Vá para Configurações → Perfil
   - Clique em "Adicionar Foto"
   - Selecione uma imagem
   - Aguarde o upload
   - ✅ Verifique se a foto apareceu

4. **Verifique no bucket R2/S3:**
   - Acesse o painel Cloudflare R2 ou AWS S3
   - Navegue até o bucket `belezeiro-uploads`
   - Verifique se o arquivo está em `profile/usr_xxx/timestamp_random.jpg`

### Teste via cURL (Backend)

```bash
# 1. Gerar pre-signed URL
curl -X POST http://localhost:3000/api/upload/generate-url \
  -H "Cookie: session_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "profile",
    "file_name": "test.jpg",
    "content_type": "image/jpeg"
  }'

# Copie o upload_url retornado

# 2. Fazer upload direto para R2/S3
curl -X PUT "URL_RETORNADA_ACIMA" \
  -H "Content-Type: image/jpeg" \
  --data-binary "@/path/to/image.jpg"

# 3. Confirmar upload
curl -X POST http://localhost:3000/api/upload/confirm/user-photo \
  -H "Cookie: session_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "key": "profile/usr_xxx/timestamp_random.jpg"
  }'
```

### Teste de Performance

```bash
# Teste de upload em batch (15 fotos)
time curl -X POST http://localhost:3000/api/upload/generate-batch-urls \
  -H "Cookie: session_token=YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "gallery",
    "files": [
      {"file_name": "photo1.jpg", "content_type": "image/jpeg"},
      {"file_name": "photo2.jpg", "content_type": "image/jpeg"},
      ... (até 15)
    ]
  }'

# Deve retornar em < 2 segundos
```

---

## Troubleshooting

### Erro: `AccessDenied`

**Problema:** Credenciais inválidas ou sem permissões

**Solução:**
1. Verifique se as variáveis de ambiente estão corretas
2. R2: Certifique-se que o token tem permissão `Object Read & Write`
3. S3: Verifique a IAM policy do usuário

### Erro: `CORS error` no browser

**Problema:** CORS não configurado ou mal configurado

**Solução:**
1. Verifique a política CORS no bucket
2. Adicione **todos** os domínios de frontend (dev + prod)
3. Inclua métodos: `PUT`, `POST`, `DELETE`
4. Aguarde 5 minutos para propagação

### Erro: `SignatureDoesNotMatch`

**Problema:** Secret access key incorreta ou relógio do servidor dessinc

**Solução:**
1. Regenere as credenciais no painel R2/S3
2. Atualize as variáveis de ambiente
3. Reinicie a API
4. Verifique o horário do servidor: `date`

### Upload funciona mas retorna 404 ao acessar

**Problema:** URL pública não configurada ou bucket privado

**Solução R2:**
1. Habilite "Public Access" no bucket
2. Configure `R2_PUBLIC_URL` corretamente
3. Ou configure Custom Domain

**Solução S3:**
1. Configure CloudFront distribution
2. Configure `AWS_CLOUDFRONT_URL`
3. Ou use pre-signed URLs para download também

### Upload muito lento

**Problema:** Região do bucket longe dos usuários

**Solução:**
- R2: Use `Automatic` location (já é distribuído globalmente)
- S3: Considere usar CloudFront ou mover bucket para `sa-east-1` (São Paulo)

### Erro: `EntityTooLarge`

**Problema:** Arquivo maior que o limite configurado

**Solução:**
1. Verifique `max_size_bytes` no frontend
2. Aumente o limite no use case (máximo 10MB)
3. Configure bucket policy para aceitar arquivos maiores

---

## Custos Estimados

### Cloudflare R2

**Armazenamento:** $0.015/GB/mês
**Operações Classe A:** $4.50/milhão (PUT, POST, LIST)
**Operações Classe B:** $0.36/milhão (GET, HEAD)
**Egress:** **GRÁTIS** 🎉

**Exemplo:** 100GB + 1M uploads/mês = **$6/mês**

### AWS S3

**Armazenamento:** $0.023/GB/mês (primeiros 50TB)
**PUT/POST:** $0.005/1000 requests
**GET:** $0.0004/1000 requests
**Egress:** $0.09/GB (primeiros 10TB) 💸

**Exemplo:** 100GB + 1M uploads/mês + 10GB egress = **$14/mês**

---

## Próximos Passos

1. ✅ Configurar R2 bucket em produção
2. ✅ Configurar custom domain `cdn.belezeiro.com.br`
3. ⬜ Implementar compressão de imagens no frontend
4. ⬜ Implementar geração de thumbnails (Cloudflare Images?)
5. ⬜ Configurar lifecycle rules para cleanup de uploads antigos
6. ⬜ Monitorar custos e uso via Cloudflare Analytics

---

## Recursos Adicionais

- [Cloudflare R2 Docs](https://developers.cloudflare.com/r2/)
- [AWS S3 Docs](https://docs.aws.amazon.com/s3/)
- [R2 Pricing](https://developers.cloudflare.com/r2/pricing/)
- [S3 vs R2 Comparison](https://www.cloudflare.com/products/r2/)

---

**Última atualização:** 2024-01-15
**Versão:** 1.0.0
**Mantido por:** Equipe Belezeiro
