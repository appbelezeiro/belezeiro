# Resumo Completo: Arquitetura de Booking e Sistema de Perfis

## 1. Visão Geral

Este documento descreve a arquitetura proposta para o sistema de booking do Belezeiro, incluindo a reestruturação do modelo de usuários com perfis compostos e o sistema de relacionamentos entre usuários, organizações e unidades.

### 1.1 Problemas Identificados no Sistema Atual

1. **Sem vínculo Profissional-Unidade**: `BookingRule` possui apenas `user_id`, sem `unit_id`
2. **Dois sistemas de regras desconectados**: `BookingRule` (usuário) vs `UnitAvailabilityRule` (unidade)
3. **Sem validação**: Sistema não verifica se profissional pertence à unidade ao criar booking
4. **Risco de duplicação**: Dados do profissional precisariam ser reentrados para cada unidade

### 1.2 Solução Proposta

- **Composição sobre Herança**: User como identidade pura + Perfis opcionais
- **Entidades de Relacionamento**: Tabelas N:N com dados próprios (não apenas join tables)
- **Histórico Imutável**: Arrays JSON para tracking de joins/leaves
- **Atualização Híbrida de Stats**: Inline para contadores simples, async para cálculos complexos

---

## 2. Estrutura de Diretórios

```
src/
├── domain/                    # Regras de negócio puras
│   ├── entities/
│   │   ├── users/
│   │   │   └── user.entity.ts
│   │   ├── profiles/
│   │   │   ├── professional-profile.entity.ts
│   │   │   ├── business-profile.entity.ts
│   │   │   └── customer-profile.entity.ts
│   │   ├── organizations/
│   │   │   ├── organization.entity.ts
│   │   │   └── organization-member.entity.ts
│   │   ├── units/
│   │   │   ├── unit.entity.ts
│   │   │   ├── unit-professional.entity.ts
│   │   │   ├── unit-customer.entity.ts
│   │   │   ├── unit-availability-rule.entity.ts
│   │   │   └── unit-availability-exception.entity.ts
│   │   └── bookings/
│   │       ├── booking.entity.ts
│   │       ├── booking-rule.entity.ts
│   │       └── booking-exception.entity.ts
│   │
│   ├── value-objects/
│   │   ├── shared/
│   │   │   ├── phone.vo.ts
│   │   │   ├── email.vo.ts
│   │   │   ├── document.vo.ts
│   │   │   ├── address.vo.ts
│   │   │   └── time-slot.vo.ts
│   │   ├── profiles/
│   │   │   ├── certification.vo.ts
│   │   │   ├── portfolio-item.vo.ts
│   │   │   ├── social-links.vo.ts
│   │   │   ├── business-history-item.vo.ts
│   │   │   └── achievement.vo.ts
│   │   └── units/
│   │       ├── commission.vo.ts
│   │       ├── professional-history-entry.vo.ts
│   │       └── customer-stats.vo.ts
│   │
│   ├── services/              # Domain Services
│   │   ├── availability.domain-service.ts
│   │   └── commission-calculator.domain-service.ts
│   │
│   └── errors/
│       ├── users/
│       ├── profiles/
│       ├── organizations/
│       ├── units/
│       └── bookings/
│
├── contracts/                 # Ports - Interfaces (abstrações)
│   ├── repositories/
│   │   ├── users/
│   │   │   └── user.repository.ts
│   │   ├── profiles/
│   │   │   ├── professional-profile.repository.ts
│   │   │   ├── business-profile.repository.ts
│   │   │   └── customer-profile.repository.ts
│   │   ├── organizations/
│   │   │   ├── organization.repository.ts
│   │   │   └── organization-member.repository.ts
│   │   ├── units/
│   │   │   ├── unit.repository.ts
│   │   │   ├── unit-professional.repository.ts
│   │   │   └── unit-customer.repository.ts
│   │   └── bookings/
│   │       └── booking.repository.ts
│   │
│   ├── providers/
│   │   ├── auth.provider.ts
│   │   ├── storage.provider.ts
│   │   ├── notification.provider.ts
│   │   └── payment.provider.ts
│   │
│   └── services/
│       └── availability.service.ts
│
├── application/               # Casos de uso (orquestração)
│   ├── use-cases/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── organizations/
│   │   ├── units/
│   │   └── bookings/
│   │
│   ├── dtos/
│   │   ├── users/
│   │   ├── profiles/
│   │   ├── organizations/
│   │   ├── units/
│   │   └── bookings/
│   │
│   └── errors/
│       └── application.errors.ts
│
├── infra/                     # Adapters - Implementações concretas
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── repositories/
│   │   │   │   ├── users/
│   │   │   │   ├── profiles/
│   │   │   │   ├── organizations/
│   │   │   │   ├── units/
│   │   │   │   └── bookings/
│   │   │   ├── mappers/
│   │   │   └── prisma.service.ts
│   │   └── in-memory/
│   │       └── repositories/
│   │
│   ├── providers/
│   │   ├── firebase-auth.provider.ts
│   │   ├── s3-storage.provider.ts
│   │   ├── twilio-notification.provider.ts
│   │   └── stripe-payment.provider.ts
│   │
│   ├── services/
│   │   └── availability.service.impl.ts
│   │
│   └── http/
│       ├── controllers/
│       │   ├── users/
│       │   ├── profiles/
│       │   ├── organizations/
│       │   ├── units/
│       │   └── bookings/
│       ├── routes/
│       │   ├── users/
│       │   ├── profiles/
│       │   ├── organizations/
│       │   ├── units/
│       │   └── bookings/
│       ├── middlewares/
│       │   ├── auth.middleware.ts
│       │   ├── error-handler.middleware.ts
│       │   └── validation.middleware.ts
│       └── errors/
│           └── http.errors.ts
│
├── main/                      # Bootstrap da aplicação
│   ├── index.ts               # Entry point
│   ├── container.ts           # Dependency injection
│   ├── config.ts              # Configurações
│   └── server.ts              # Setup do servidor HTTP
│
└── shared/                    # Utilitários compartilhados
    ├── utils/
    │   ├── date.utils.ts
    │   ├── string.utils.ts
    │   └── validation.utils.ts
    ├── types/
    │   └── common.types.ts
    └── constants/
        └── app.constants.ts
```

---

## 3. Modelagem DDD

### 3.1 Bounded Contexts

```
┌─────────────────────────────────────────────────────────────────────┐
│                         IDENTITY CONTEXT                             │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ User (Aggregate Root)                                        │    │
│  │   └── ProfessionalProfile (1:1 opcional)                     │    │
│  │   └── BusinessProfile (1:1 opcional)                         │    │
│  │   └── CustomerProfile (1:1 opcional)                         │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                       ORGANIZATION CONTEXT                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Organization (Aggregate Root)                                │    │
│  │   └── OrganizationMember (Entity)                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                          UNIT CONTEXT                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Unit (Aggregate Root)                                        │    │
│  │   └── UnitProfessional (Entity)                              │    │
│  │   └── UnitCustomer (Entity)                                  │    │
│  │   └── UnitAvailabilityRule (Entity)                          │    │
│  │   └── UnitAvailabilityException (Entity)                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                         BOOKING CONTEXT                              │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ Booking (Aggregate Root)                                     │    │
│  │   └── BookingRule (Entity) - regras do profissional          │    │
│  │   └── BookingException (Entity) - exceções do profissional   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Diagrama de Relacionamentos

```
                            ┌──────────────┐
                            │     User     │
                            │   (usr_*)    │
                            └──────┬───────┘
                                   │
           ┌───────────────────────┼───────────────────────┐
           │                       │                       │
           ▼                       ▼                       ▼
┌─────────────────────┐ ┌─────────────────────┐ ┌─────────────────────┐
│ ProfessionalProfile │ │   BusinessProfile   │ │   CustomerProfile   │
│     (pprof_*)       │ │     (bprof_*)       │ │     (cprof_*)       │
│      1:1 opt        │ │      1:1 opt        │ │      1:1 opt        │
└─────────────────────┘ └─────────────────────┘ └─────────────────────┘

                            ┌──────────────┐
                            │     User     │
                            └──────┬───────┘
                                   │
        ┌──────────────────────────┼──────────────────────────┐
        │                          │                          │
        ▼                          ▼                          ▼
┌───────────────────┐    ┌─────────────────────┐    ┌─────────────────┐
│OrganizationMember │    │  UnitProfessional   │    │   UnitCustomer  │
│    (orgm_*)       │    │     (upro_*)        │    │    (ucust_*)    │
│       N:N         │    │        N:N          │    │       N:N       │
└────────┬──────────┘    └──────────┬──────────┘    └────────┬────────┘
         │                          │                        │
         ▼                          ▼                        ▼
┌───────────────────┐         ┌──────────┐            ┌──────────┐
│   Organization    │         │   Unit   │            │   Unit   │
│     (org_*)       │◄────────│ (unit_*) │            │ (unit_*) │
└───────────────────┘         └──────────┘            └──────────┘
         │                          │
         └──────────────────────────┘
              Organization has many Units
```

---

## 4. Definição das Entidades

### 4.1 User (Aggregate Root - Identity Context)

```typescript
// Prefixo: usr_*
User {
  id: string                      // usr_*
  name: string
  email: string                   // Único
  providerId: string              // Firebase UID
  photoUrl?: string
  document?: Document             // Value Object (CPF/CNPJ)
  phone?: Phone                   // Value Object
  birthDate?: Date
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  onboardingCompleted: boolean
  emailVerified: boolean
  phoneVerified: boolean
  created_at: DateTime
  updated_at: DateTime
  deleted_at?: DateTime           // Soft delete
}
```

### 4.2 ProfessionalProfile (Entity - 1:1 com User)

```typescript
// Prefixo: pprof_*
// Criado apenas quando User assume papel de profissional
// Dados GLOBAIS reutilizáveis em qualquer unidade
ProfessionalProfile {
  id: string                      // pprof_*
  userId: string                  // FK -> User, UNIQUE (1:1)

  // Informações de apresentação
  displayName?: string            // Nome artístico/profissional
  bio?: string                    // Biografia profissional

  // Experiência global
  yearsOfExperience?: number

  // Certificações (reaproveitadas em todas as unidades)
  certifications: Certification[] // Value Object[]

  // Portfólio de trabalhos
  portfolio: PortfolioItem[]      // Value Object[]

  // Especialidades que conhece (IDs globais)
  knownSpecialtyIds: string[]

  // Redes sociais profissionais
  socialLinks?: SocialLinks       // Value Object

  created_at: DateTime
  updated_at: DateTime
}
```

### 4.3 BusinessProfile (Entity - 1:1 com User)

```typescript
// Prefixo: bprof_*
// Criado apenas quando User assume papel de dono de negócio
// Dados GLOBAIS sobre experiência em gestão
BusinessProfile {
  id: string                      // bprof_*
  userId: string                  // FK -> User, UNIQUE (1:1)

  // Informações de apresentação
  displayName?: string            // Nome empresarial
  bio?: string                    // Sobre o empreendedor

  // Experiência em gestão
  yearsInBusiness?: number

  // Certificações em gestão/administração
  certifications: Certification[] // Value Object[]

  // Histórico de negócios anteriores
  businessHistory: BusinessHistoryItem[] // Value Object[]

  // Conquistas/Prêmios
  achievements: Achievement[]     // Value Object[]

  // Redes sociais profissionais
  socialLinks?: SocialLinks       // Value Object

  created_at: DateTime
  updated_at: DateTime
}
```

### 4.4 CustomerProfile (Entity - 1:1 com User)

```typescript
// Prefixo: cprof_*
// Criado quando User realiza primeiro booking ou se registra como cliente
// Dados GLOBAIS de preferências do cliente
CustomerProfile {
  id: string                        // cprof_*
  userId: string                    // FK -> User, UNIQUE (1:1)

  // Preferências de agendamento
  preferredTimeSlots?: ('morning' | 'afternoon' | 'evening' | 'night')[]
  preferredDays?: number[]          // 0=Dom, 1=Seg, ..., 6=Sab

  // Interesses
  interestedSpecialtyIds?: string[]

  // Características físicas (para serviços de beleza)
  hairType?: 'straight' | 'wavy' | 'curly' | 'coily'
  skinType?: 'normal' | 'dry' | 'oily' | 'combination' | 'sensitive'

  // Saúde e segurança
  allergies?: string[]
  medicalConditions?: string[]

  // Estatísticas globais (atualização híbrida)
  stats: {
    totalBookings: number           // Inline: incremento simples
    totalSpentCents: number         // Inline: soma simples
    cancelledBookings: number       // Inline: incremento simples
    noShowCount: number             // Inline: incremento simples
    firstBookingAt?: DateTime       // Inline: set once
    lastBookingAt?: DateTime        // Inline: update always
    // Campos calculados via job assíncrono:
    averageRating?: number          // Async: média complexa
    favoriteServiceId?: string      // Async: agregação
    favoriteProfessionalId?: string // Async: agregação
  }

  // Marketing
  acceptsMarketing: boolean
  preferredContactChannel?: 'whatsapp' | 'email' | 'sms' | 'push'

  created_at: DateTime
  updated_at: DateTime
}
```

### 4.5 Organization (Aggregate Root - Organization Context)

```typescript
// Prefixo: org_*
// Representa um negócio/empresa
Organization {
  id: string                      // org_*
  name: string                    // Nome do negócio (2-100 chars)
  ownerId: string                 // FK -> User (criador original)

  // Dados empresariais
  document?: Document             // Value Object (CNPJ)
  tradingName?: string            // Nome fantasia

  // Configurações
  settings: {
    defaultCurrency: string       // BRL, USD, etc.
    timezone: string              // America/Sao_Paulo
    locale: string                // pt-BR
  }

  // Status
  isActive: boolean

  created_at: DateTime
  updated_at: DateTime
}
```

### 4.6 OrganizationMember (Entity - N:N User-Organization)

```typescript
// Prefixo: orgm_*
// Relaciona User com Organization com dados próprios
// Um User pode ser membro de várias Organizations
OrganizationMember {
  id: string                      // orgm_*
  organizationId: string          // FK -> Organization
  userId: string                  // FK -> User

  // Papel na organização
  role: 'owner' | 'admin' | 'manager' | 'viewer'

  // Permissões granulares (opcional, override do role)
  permissions?: string[]          // ['units:create', 'members:invite', etc.]

  // Status
  isActive: boolean

  // Rastreamento de convite
  invitedByUserId?: string        // Quem convidou
  invitedAt?: DateTime
  acceptedAt?: DateTime

  created_at: DateTime
  updated_at: DateTime

  // Constraint: @@unique([organizationId, userId])
}
```

### 4.7 Unit (Aggregate Root - Unit Context)

```typescript
// Prefixo: unit_*
// Representa uma unidade física do negócio
Unit {
  id: string                      // unit_*
  orgId: string                   // FK -> Organization
  name: string

  // Localização
  address?: Address               // Value Object
  phones: Phone[]                 // Value Object[]

  // Apresentação
  logo?: URLAddress               // Value Object
  gallery: URLAddress[]           // Value Object[]

  // Categorização
  serviceType: 'beauty_salon' | 'barbershop' | 'spa' | 'clinic' | 'other'
  especialidades: SpecialtyEntity[]
  services: ServiceEntity[]
  amenities: AmenityEntity[]

  // Configurações
  preferences: {
    bookingAdvanceMinDays?: number
    bookingAdvanceMaxDays?: number
    cancellationPolicyHours?: number
    // ... outras preferências
  }

  // Status
  active: boolean

  created_at: DateTime
  updated_at: DateTime
}
```

### 4.8 UnitProfessional (Entity - N:N User-Unit como Profissional)

```typescript
// Prefixo: upro_*
// Relaciona User com Unit como profissional
// Dados ESPECÍFICOS deste profissional NESTA unidade
UnitProfessional {
  id: string                      // upro_*
  unitId: string                  // FK -> Unit
  userId: string                  // FK -> User

  // Papel na unidade
  role: 'professional' | 'receptionist' | 'manager'

  // Pode receber agendamentos?
  canReceiveBookings: boolean

  // Override de dados do ProfessionalProfile para esta unidade
  displayNameOverride?: string    // Se diferente do profile global
  bioOverride?: string            // Bio específica para esta unidade

  // Serviços que realiza NESTA unidade
  specialtyIds: string[]          // Subset das especialidades globais
  serviceIds: string[]            // Serviços específicos da unidade

  // Comissão nesta unidade
  commission: Commission          // Value Object

  // Status atual
  isActive: boolean
  currentStartedAt: DateTime      // Quando iniciou o período atual

  // Histórico de entradas/saídas (array imutável)
  history: ProfessionalHistoryEntry[] // Value Object[]

  created_at: DateTime
  updated_at: DateTime

  // Constraint: @@unique([unitId, userId])
}
```

### 4.9 UnitCustomer (Entity - N:N User-Unit como Cliente)

```typescript
// Prefixo: ucust_*
// Relaciona User com Unit como cliente
// Dados ESPECÍFICOS deste cliente NESTA unidade
UnitCustomer {
  id: string                      // ucust_*
  unitId: string                  // FK -> Unit
  userId: string                  // FK -> User

  // Notas internas (visíveis apenas para a unidade)
  notes?: string
  internalTags?: string[]         // ['vip', 'allergic', etc.]

  // Fidelidade nesta unidade
  loyaltyPoints: number
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum'

  // Preferências nesta unidade
  preferredProfessionalId?: string // FK -> UnitProfessional

  // Estatísticas NESTA unidade (atualização híbrida)
  stats: CustomerStats            // Value Object

  // Status
  isActive: boolean
  isBlocked: boolean
  blockedReason?: string

  // Origem
  source?: 'organic' | 'referral' | 'marketing' | 'walk_in' | 'other'
  referredByCustomerId?: string   // FK -> UnitCustomer

  created_at: DateTime
  updated_at: DateTime

  // Constraint: @@unique([unitId, userId])
}
```

---

## 5. Definição dos Value Objects

### 5.1 Value Objects Compartilhados

```typescript
// Phone - Número de telefone
Phone {
  countryCode: string     // +55
  areaCode: string        // 11
  number: string          // 999999999
  type?: 'mobile' | 'landline' | 'whatsapp'
  isWhatsapp: boolean

  // Métodos
  format(): string        // +55 (11) 99999-9999
  formatE164(): string    // +5511999999999
  equals(other: Phone): boolean
}

// Email - Email validado
Email {
  value: string

  // Validação no construtor
  // Métodos
  getDomain(): string
  equals(other: Email): boolean
}

// Document - CPF ou CNPJ
Document {
  value: string           // Apenas números
  type: 'cpf' | 'cnpj'

  // Validação no construtor (dígitos verificadores)
  // Métodos
  format(): string        // 123.456.789-00 ou 12.345.678/0001-90
  equals(other: Document): boolean
}

// Address - Endereço completo
Address {
  street: string
  number: string
  complement?: string
  neighborhood: string
  city: string
  state: string
  country: string
  zipCode: string
  coordinates?: {
    latitude: number
    longitude: number
  }

  // Métodos
  format(): string
  formatShort(): string
  equals(other: Address): boolean
}

// TimeSlot - Intervalo de tempo
TimeSlot {
  startTime: string       // HH:mm
  endTime: string         // HH:mm

  // Validação: start < end
  // Métodos
  getDurationMinutes(): number
  overlaps(other: TimeSlot): boolean
  contains(time: string): boolean
  equals(other: TimeSlot): boolean
}

// URLAddress - URL validada
URLAddress {
  value: string

  // Validação de URL no construtor
  // Métodos
  getDomain(): string
  isSecure(): boolean     // https
  equals(other: URLAddress): boolean
}
```

### 5.2 Value Objects de Profiles

```typescript
// Certification - Certificação profissional/empresarial
Certification {
  id: string              // Gerado (cert_*)
  name: string
  institution?: string
  year?: number
  category: 'technical' | 'safety' | 'specialization' | 'management' | 'other'
  documentUrl?: string
  isVerified: boolean     // Verificado pela plataforma

  // Métodos
  equals(other: Certification): boolean
}

// PortfolioItem - Item do portfólio
PortfolioItem {
  id: string              // Gerado (port_*)
  url: string             // URL da imagem/vídeo
  description?: string
  serviceType?: string    // Tipo de serviço relacionado
  createdAt: DateTime

  // Métodos
  equals(other: PortfolioItem): boolean
}

// SocialLinks - Links de redes sociais
SocialLinks {
  instagram?: string
  facebook?: string
  linkedin?: string
  twitter?: string
  tiktok?: string
  youtube?: string
  website?: string

  // Métodos
  toArray(): { platform: string; url: string }[]
  equals(other: SocialLinks): boolean
}

// BusinessHistoryItem - Histórico de negócios
BusinessHistoryItem {
  id: string              // Gerado (bhist_*)
  businessName: string
  role: string            // Cargo/função
  segment: string         // Segmento do negócio
  startYear: number
  endYear?: number        // null = atual
  description?: string

  // Métodos
  getDurationYears(): number
  isCurrent(): boolean
  equals(other: BusinessHistoryItem): boolean
}

// Achievement - Conquista/Prêmio
Achievement {
  id: string              // Gerado (achv_*)
  title: string
  year: number
  issuer?: string         // Quem concedeu
  description?: string
  documentUrl?: string

  // Métodos
  equals(other: Achievement): boolean
}
```

### 5.3 Value Objects de Units

```typescript
// Commission - Comissão do profissional
Commission {
  type: 'percentage' | 'fixed' | 'mixed'
  percentageValue?: number    // 0-100
  fixedValueCents?: number    // Em centavos

  // Métodos
  calculate(servicePriceCents: number): number  // Retorna comissão em centavos
  format(): string            // "30%" ou "R$ 50,00" ou "20% + R$ 10,00"
  equals(other: Commission): boolean
}

// Exemplo de cálculo:
// type: 'percentage', percentageValue: 30
// calculate(10000) → 3000 (30% de R$ 100,00)
//
// type: 'fixed', fixedValueCents: 5000
// calculate(10000) → 5000 (R$ 50,00 fixo)
//
// type: 'mixed', percentageValue: 20, fixedValueCents: 1000
// calculate(10000) → 3000 (20% de 100 = 20 + 10 fixo = 30)

// ProfessionalHistoryEntry - Entrada no histórico (imutável)
ProfessionalHistoryEntry {
  action: 'joined' | 'left'
  at: DateTime
  reason?: 'resigned' | 'terminated' | 'contract_ended' | 'transferred' | 'other'
  notes?: string

  // Imutável - não possui métodos de alteração
  // Métodos
  equals(other: ProfessionalHistoryEntry): boolean
}

// CustomerStats - Estatísticas do cliente na unidade
CustomerStats {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  noShowCount: number
  totalSpentCents: number
  averageTicketCents: number      // Calculado async
  lastBookingAt?: DateTime
  firstBookingAt?: DateTime

  // Calculados via job assíncrono:
  averageRating?: number
  favoriteServiceId?: string
  favoriteProfessionalId?: string

  // Métodos
  incrementBooking(valueCents: number): CustomerStats  // Retorna novo VO
  incrementCancellation(): CustomerStats
  incrementNoShow(): CustomerStats
  equals(other: CustomerStats): boolean
}
```

---

## 6. CRUDs e Use Cases

### 6.1 User

```
Routes:
  GET    /users/me                     → GetCurrentUserUseCase
  PATCH  /users/me                     → UpdateUserUseCase
  DELETE /users/me                     → DeleteUserUseCase (soft delete)

Use Cases:
  - GetCurrentUserUseCase
    Input: userId (do token)
    Output: User + profiles existentes

  - UpdateUserUseCase
    Input: userId, { name?, photoUrl?, phone?, birthDate?, gender? }
    Output: User atualizado

  - DeleteUserUseCase
    Input: userId
    Output: void (soft delete)
```

### 6.2 Profiles

```
Routes - ProfessionalProfile:
  GET    /profiles/professional        → GetProfessionalProfileUseCase
  POST   /profiles/professional        → CreateProfessionalProfileUseCase
  PATCH  /profiles/professional        → UpdateProfessionalProfileUseCase

  POST   /profiles/professional/certifications     → AddCertificationUseCase
  DELETE /profiles/professional/certifications/:id → RemoveCertificationUseCase

  POST   /profiles/professional/portfolio          → AddPortfolioItemUseCase
  DELETE /profiles/professional/portfolio/:id      → RemovePortfolioItemUseCase

Routes - BusinessProfile:
  GET    /profiles/business            → GetBusinessProfileUseCase
  POST   /profiles/business            → CreateBusinessProfileUseCase
  PATCH  /profiles/business            → UpdateBusinessProfileUseCase

  POST   /profiles/business/certifications      → AddBusinessCertificationUseCase
  DELETE /profiles/business/certifications/:id  → RemoveBusinessCertificationUseCase

  POST   /profiles/business/history             → AddBusinessHistoryUseCase
  DELETE /profiles/business/history/:id         → RemoveBusinessHistoryUseCase

Routes - CustomerProfile:
  GET    /profiles/customer            → GetCustomerProfileUseCase
  POST   /profiles/customer            → CreateCustomerProfileUseCase
  PATCH  /profiles/customer            → UpdateCustomerProfileUseCase

Use Cases principais:
  - CreateProfessionalProfileUseCase
    Input: userId, { displayName?, bio?, yearsOfExperience?, socialLinks? }
    Output: ProfessionalProfile criado
    Regras:
      - User não pode ter ProfessionalProfile existente

  - AddCertificationUseCase
    Input: userId, { name, institution?, year?, category, documentUrl? }
    Output: ProfessionalProfile com nova certificação

  - CreateCustomerProfileUseCase
    Input: userId, { preferredTimeSlots?, acceptsMarketing? }
    Output: CustomerProfile criado
    Obs: Pode ser criado automaticamente no primeiro booking
```

### 6.3 Organization

```
Routes:
  GET    /organizations                → ListUserOrganizationsUseCase
  POST   /organizations                → CreateOrganizationUseCase
  GET    /organizations/:id            → GetOrganizationUseCase
  PATCH  /organizations/:id            → UpdateOrganizationUseCase
  DELETE /organizations/:id            → DeleteOrganizationUseCase

Use Cases:
  - CreateOrganizationUseCase
    Input: userId, { name, document?, tradingName?, settings? }
    Output: Organization criada
    Regras:
      - Cria OrganizationMember com role='owner' automaticamente
      - Pode criar BusinessProfile para o user se não existir

  - ListUserOrganizationsUseCase
    Input: userId
    Output: Organization[] (via OrganizationMember)
```

### 6.4 OrganizationMember

```
Routes:
  GET    /organizations/:orgId/members           → ListOrganizationMembersUseCase
  POST   /organizations/:orgId/members/invite    → InviteMemberUseCase
  PATCH  /organizations/:orgId/members/:id       → UpdateMemberUseCase
  DELETE /organizations/:orgId/members/:id       → RemoveMemberUseCase

Use Cases:
  - InviteMemberUseCase
    Input: orgId, inviterId, { email, role, permissions? }
    Output: OrganizationMember (pendente)
    Regras:
      - Apenas owner/admin pode convidar
      - Não pode convidar role superior ao próprio

  - UpdateMemberUseCase
    Input: orgId, memberId, { role?, permissions?, isActive? }
    Output: OrganizationMember atualizado
    Regras:
      - Não pode alterar próprio role
      - Owner não pode ser rebaixado
```

### 6.5 Unit

```
Routes:
  GET    /organizations/:orgId/units        → ListOrganizationUnitsUseCase
  POST   /organizations/:orgId/units        → CreateUnitUseCase
  GET    /units/:id                         → GetUnitUseCase
  PATCH  /units/:id                         → UpdateUnitUseCase
  DELETE /units/:id                         → DeleteUnitUseCase

Use Cases:
  - CreateUnitUseCase
    Input: orgId, userId, { name, address?, phones, serviceType, preferences? }
    Output: Unit criada
    Regras:
      - Apenas members com permissão podem criar
```

### 6.6 UnitProfessional

```
Routes:
  GET    /units/:unitId/professionals           → ListUnitProfessionalsUseCase
  POST   /units/:unitId/professionals           → AddProfessionalToUnitUseCase
  GET    /units/:unitId/professionals/:id       → GetUnitProfessionalUseCase
  PATCH  /units/:unitId/professionals/:id       → UpdateUnitProfessionalUseCase
  DELETE /units/:unitId/professionals/:id       → RemoveProfessionalFromUnitUseCase

Use Cases:
  - AddProfessionalToUnitUseCase
    Input: unitId, { userId, role, canReceiveBookings, specialtyIds, serviceIds, commission }
    Output: UnitProfessional criado
    Regras:
      - User deve ter ProfessionalProfile (criar se não existir?)
      - specialtyIds deve ser subset de ProfessionalProfile.knownSpecialtyIds
      - Adiciona entry 'joined' no history

  - UpdateUnitProfessionalUseCase
    Input: unitId, id, { role?, canReceiveBookings?, specialtyIds?, serviceIds?, commission?, isActive?, displayNameOverride?, bioOverride? }
    Output: UnitProfessional atualizado
    Regras:
      - Se isActive mudar de true para false:
        - Adiciona entry 'left' no history
      - Se isActive mudar de false para true:
        - Adiciona entry 'joined' no history
        - Atualiza currentStartedAt

  - RemoveProfessionalFromUnitUseCase
    Input: unitId, id
    Output: void
    Regras:
      - Não remove o registro, apenas marca isActive=false
      - Adiciona entry 'left' no history
      - Pode ter regra de não permitir se tiver bookings futuros
```

### 6.7 UnitCustomer

```
Routes:
  GET    /units/:unitId/customers               → ListUnitCustomersUseCase
  POST   /units/:unitId/customers               → AddCustomerToUnitUseCase
  GET    /units/:unitId/customers/:id           → GetUnitCustomerUseCase
  PATCH  /units/:unitId/customers/:id           → UpdateUnitCustomerUseCase
  DELETE /units/:unitId/customers/:id           → RemoveCustomerFromUnitUseCase

  POST   /units/:unitId/customers/:id/block     → BlockCustomerUseCase
  POST   /units/:unitId/customers/:id/unblock   → UnblockCustomerUseCase

Use Cases:
  - AddCustomerToUnitUseCase
    Input: unitId, { userId, notes?, internalTags?, source? }
    Output: UnitCustomer criado
    Regras:
      - Pode criar CustomerProfile automaticamente se não existir
      - Stats inicializado zerado

  - UpdateUnitCustomerUseCase
    Input: unitId, id, { notes?, internalTags?, preferredProfessionalId?, loyaltyTier? }
    Output: UnitCustomer atualizado

  - BlockCustomerUseCase
    Input: unitId, id, { reason }
    Output: UnitCustomer bloqueado
    Regras:
      - Cancelar bookings futuros automaticamente?
```

### 6.8 Booking (atualizado)

```
Routes existentes:
  GET    /bookings                      → ListBookingsUseCase
  POST   /bookings                      → CreateBookingUseCase
  GET    /bookings/:id                  → GetBookingUseCase
  PATCH  /bookings/:id                  → UpdateBookingUseCase
  DELETE /bookings/:id                  → CancelBookingUseCase

  GET    /units/:unitId/availability    → GetUnitAvailabilityUseCase

Use Cases atualizados:
  - CreateBookingUseCase (validações adicionais)
    Input: { unitId, professionalId, customerId, serviceId, startTime, endTime }
    Validações NOVAS:
      1. Verificar se UnitProfessional existe e isActive=true
      2. Verificar se UnitProfessional.canReceiveBookings=true
      3. Verificar se serviceId está em UnitProfessional.serviceIds
      4. Verificar UnitAvailabilityRule da unidade
      5. Verificar BookingRule do profissional
      6. Verificar se não há conflito com outros bookings
    Output: Booking criado
    Side effects:
      - Atualizar CustomerProfile.stats (inline: totalBookings, lastBookingAt)
      - Atualizar UnitCustomer.stats (inline: totalBookings, lastBookingAt)
```

---

## 7. Regras de Dependência entre Camadas

```
┌─────────────────────────────────────────────────────────────────────┐
│                           MAIN                                       │
│  - Conhece TODAS as camadas                                         │
│  - Responsável por montar o container de DI                         │
│  - Conecta interfaces (contracts) às implementações (infra)         │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           INFRA                                      │
│  - Implementa interfaces de CONTRACTS                               │
│  - Conhece: domain, contracts, application                          │
│  - NÃO conhece: main                                                │
│  - Controllers usam Use Cases de application                        │
│  - Repositories implementam interfaces de contracts                 │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         APPLICATION                                  │
│  - Orquestra o fluxo de negócio                                     │
│  - Conhece: domain, contracts                                       │
│  - NÃO conhece: infra, main                                         │
│  - Usa interfaces de CONTRACTS (não implementações)                 │
│  - Usa entidades e VOs de DOMAIN                                    │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         CONTRACTS                                    │
│  - Define interfaces (ports)                                        │
│  - Conhece: domain (para tipos)                                     │
│  - NÃO conhece: application, infra, main                            │
│  - São abstrações puras                                             │
└─────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           DOMAIN                                     │
│  - Regras de negócio puras                                          │
│  - NÃO conhece nenhuma outra camada                                 │
│  - Entidades, Value Objects, Domain Services, Domain Errors         │
│  - Zero dependências externas (exceto libs de utilidade pura)       │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│                           SHARED                                     │
│  - Utilitários puros sem lógica de negócio                          │
│  - Pode ser usado por QUALQUER camada                               │
│  - NÃO conhece nenhuma camada específica                            │
└─────────────────────────────────────────────────────────────────────┘
```

### 7.1 Exemplo de Fluxo

```
1. Request HTTP chega
2. INFRA/HTTP: Route → Controller
3. Controller injeta Use Case (via DI)
4. APPLICATION: Use Case executa lógica
5. Use Case usa Repository (interface de CONTRACTS)
6. INFRA/DATABASE: Repository (implementação) acessa banco
7. DOMAIN: Entidade é criada/atualizada com validações
8. Retorno sobe as camadas
```

---

## 8. Schema Prisma (Novas Tabelas)

```prisma
// Novos modelos a serem adicionados ao schema.prisma

model ProfessionalProfile {
  id                   String   @id @default(cuid())
  userId               String   @unique @map("user_id")
  displayName          String?  @map("display_name")
  bio                  String?
  yearsOfExperience    Int?     @map("years_of_experience")
  certifications       Json     @default("[]")  // Certification[]
  portfolio            Json     @default("[]")  // PortfolioItem[]
  knownSpecialtyIds    String[] @map("known_specialty_ids")
  socialLinks          Json?    @map("social_links")  // SocialLinks
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("professional_profiles")
}

model BusinessProfile {
  id                String   @id @default(cuid())
  userId            String   @unique @map("user_id")
  displayName       String?  @map("display_name")
  bio               String?
  yearsInBusiness   Int?     @map("years_in_business")
  certifications    Json     @default("[]")  // Certification[]
  businessHistory   Json     @default("[]")  // BusinessHistoryItem[]
  achievements      Json     @default("[]")  // Achievement[]
  socialLinks       Json?    @map("social_links")  // SocialLinks
  createdAt         DateTime @default(now()) @map("created_at")
  updatedAt         DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("business_profiles")
}

model CustomerProfile {
  id                       String   @id @default(cuid())
  userId                   String   @unique @map("user_id")
  preferredTimeSlots       String[] @map("preferred_time_slots")
  preferredDays            Int[]    @map("preferred_days")
  interestedSpecialtyIds   String[] @map("interested_specialty_ids")
  hairType                 String?  @map("hair_type")
  skinType                 String?  @map("skin_type")
  allergies                String[] @default([])
  medicalConditions        String[] @default([]) @map("medical_conditions")
  stats                    Json     @default("{\"totalBookings\":0,\"totalSpentCents\":0,\"cancelledBookings\":0,\"noShowCount\":0}")
  acceptsMarketing         Boolean  @default(false) @map("accepts_marketing")
  preferredContactChannel  String?  @map("preferred_contact_channel")
  createdAt                DateTime @default(now()) @map("created_at")
  updatedAt                DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("customer_profiles")
}

model OrganizationMember {
  id               String    @id @default(cuid())
  organizationId   String    @map("organization_id")
  userId           String    @map("user_id")
  role             String    // 'owner' | 'admin' | 'manager' | 'viewer'
  permissions      String[]  @default([])
  isActive         Boolean   @default(true) @map("is_active")
  invitedByUserId  String?   @map("invited_by_user_id")
  invitedAt        DateTime? @map("invited_at")
  acceptedAt       DateTime? @map("accepted_at")
  createdAt        DateTime  @default(now()) @map("created_at")
  updatedAt        DateTime  @updatedAt @map("updated_at")

  organization Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  user         User         @relation(fields: [userId], references: [id], onDelete: Cascade)
  invitedBy    User?        @relation("InvitedMembers", fields: [invitedByUserId], references: [id])

  @@unique([organizationId, userId])
  @@map("organization_members")
}

model UnitProfessional {
  id                   String   @id @default(cuid())
  unitId               String   @map("unit_id")
  userId               String   @map("user_id")
  role                 String   // 'professional' | 'receptionist' | 'manager'
  canReceiveBookings   Boolean  @default(true) @map("can_receive_bookings")
  displayNameOverride  String?  @map("display_name_override")
  bioOverride          String?  @map("bio_override")
  specialtyIds         String[] @map("specialty_ids")
  serviceIds           String[] @map("service_ids")
  commission           Json     // Commission VO
  isActive             Boolean  @default(true) @map("is_active")
  currentStartedAt     DateTime @default(now()) @map("current_started_at")
  history              Json     @default("[]")  // ProfessionalHistoryEntry[]
  createdAt            DateTime @default(now()) @map("created_at")
  updatedAt            DateTime @updatedAt @map("updated_at")

  unit Unit @relation(fields: [unitId], references: [id], onDelete: Cascade)
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([unitId, userId])
  @@map("unit_professionals")
}

model UnitCustomer {
  id                      String   @id @default(cuid())
  unitId                  String   @map("unit_id")
  userId                  String   @map("user_id")
  notes                   String?
  internalTags            String[] @default([]) @map("internal_tags")
  loyaltyPoints           Int      @default(0) @map("loyalty_points")
  loyaltyTier             String?  @map("loyalty_tier")
  preferredProfessionalId String?  @map("preferred_professional_id")
  stats                   Json     @default("{\"totalBookings\":0,\"completedBookings\":0,\"cancelledBookings\":0,\"noShowCount\":0,\"totalSpentCents\":0,\"averageTicketCents\":0}")
  isActive                Boolean  @default(true) @map("is_active")
  isBlocked               Boolean  @default(false) @map("is_blocked")
  blockedReason           String?  @map("blocked_reason")
  source                  String?  // 'organic' | 'referral' | 'marketing' | 'walk_in' | 'other'
  referredByCustomerId    String?  @map("referred_by_customer_id")
  createdAt               DateTime @default(now()) @map("created_at")
  updatedAt               DateTime @updatedAt @map("updated_at")

  unit               Unit           @relation(fields: [unitId], references: [id], onDelete: Cascade)
  user               User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  preferredProfessional UnitProfessional? @relation("PreferredProfessional", fields: [preferredProfessionalId], references: [id])
  referredBy         UnitCustomer?  @relation("CustomerReferrals", fields: [referredByCustomerId], references: [id])
  referrals          UnitCustomer[] @relation("CustomerReferrals")

  @@unique([unitId, userId])
  @@map("unit_customers")
}
```

---

## 9. Próximos Passos de Implementação

### Fase 1: Fundação
1. [ ] Atualizar schema Prisma com novas tabelas
2. [ ] Criar migrations
3. [ ] Implementar Value Objects em `domain/value-objects/`
4. [ ] Implementar novas Entities em `domain/entities/`

### Fase 2: Profiles
5. [ ] Implementar ProfessionalProfile (entity, repository, use cases, controller)
6. [ ] Implementar BusinessProfile (entity, repository, use cases, controller)
7. [ ] Implementar CustomerProfile (entity, repository, use cases, controller)

### Fase 3: Relacionamentos
8. [ ] Implementar OrganizationMember (entity, repository, use cases, controller)
9. [ ] Implementar UnitProfessional (entity, repository, use cases, controller)
10. [ ] Implementar UnitCustomer (entity, repository, use cases, controller)

### Fase 4: Integração com Booking
11. [ ] Atualizar CreateBookingUseCase com novas validações
12. [ ] Atualizar AvailabilityService para considerar UnitProfessional
13. [ ] Implementar atualização de stats (inline + jobs async)

### Fase 5: Testes
14. [ ] Testes unitários para Value Objects
15. [ ] Testes unitários para Entities
16. [ ] Testes de integração para Use Cases
17. [ ] Testes E2E para fluxos principais

---

## 10. Glossário

| Termo | Descrição |
|-------|-----------|
| **Aggregate Root** | Entidade principal que controla o acesso às entidades do agregado |
| **Entity** | Objeto com identidade única que persiste ao longo do tempo |
| **Value Object** | Objeto imutável sem identidade, definido por seus atributos |
| **Bounded Context** | Limite conceitual onde um modelo de domínio é aplicado |
| **Port** | Interface que define como o domínio interage com o mundo externo |
| **Adapter** | Implementação concreta de um Port |
| **Use Case** | Orquestrador de um fluxo de negócio específico |
| **Domain Service** | Lógica de domínio que não pertence a nenhuma entidade específica |
