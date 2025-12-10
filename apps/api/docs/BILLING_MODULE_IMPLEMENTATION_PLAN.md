# 📋 Plano de Implementação - Módulo de Billing

**Data de criação**: 2025-12-09
**Arquitetura**: Clean Architecture + DDD
**Provider de Pagamento**: Abstração via interface (provider-agnostic)

---

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Entidades de Domínio](#entidades-de-domínio)
3. [Value Objects](#value-objects)
4. [Domain Errors](#domain-errors)
5. [Domain Services](#domain-services)
6. [Repository Interfaces](#repository-interfaces)
7. [Use Cases](#use-cases)
8. [Payment Gateway (Interface)](#payment-gateway-interface)
9. [DTOs e Mappers](#dtos-e-mappers)
10. [Controllers e Routes](#controllers-e-routes)
11. [Webhooks](#webhooks)
12. [Dependency Injection](#dependency-injection)
13. [Testes](#testes)
14. [Ordem de Implementação](#ordem-de-implementação)

---

## 🎯 Visão Geral

O módulo de Billing será responsável por:

- **Gerenciamento de assinaturas** (subscriptions)
- **Gerenciamento de planos** (plans)
- **Gerenciamento de faturas** (invoices)
- **Sistema de cupons e descontos** (coupons/discounts)
- **Controle de trials e períodos gratuitos**
- **Integração com provider de pagamento** (via interface abstrata)
- **Webhooks para sincronização** (fonte da verdade)
- **Controle de limites e features** (subscription guards)

### Princípios de Design

1. **Provider-agnostic**: Gateway de pagamento é uma interface que pode ter múltiplas implementações (Stripe, Iugu, etc)
2. **Webhook-driven**: O webhook é a fonte da verdade, nunca confiar apenas no frontend
3. **Domain-first**: Regras de negócio vivem nas entidades
4. **Idempotência**: Operações críticas devem ser idempotentes
5. **Retry logic**: Sistema de dunning para falhas de pagamento

---

## 🏗️ Entidades de Domínio

### 1. `subscription.entity.ts`

**Prefixo**: `sub`

**Propriedades**:
```typescript
type SubscriptionEntityOwnProps = {
  user_id: string;                    // FK para User
  plan_id: string;                    // FK para Plan
  status: SubscriptionStatus;         // enum
  start_date: Date;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_end?: Date;
  renewal_interval: RenewalInterval;  // enum: monthly, yearly, custom
  payment_method_id?: string;         // Token do provider
  discount_id?: string;               // FK para Discount (opcional)
  provider_subscription_id?: string;  // ID no provider externo
  metadata?: Record<string, any>;     // Dados extras (convites, origem, etc)
};

enum SubscriptionStatus {
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  ACTIVE = 'active',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  CANCELED = 'canceled',
  EXPIRED = 'expired',
}

enum RenewalInterval {
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
  CUSTOM = 'custom',
}
```

**Métodos de Negócio**:
```typescript
activate(): void
cancel(immediate: boolean): void
reactivate(): void
mark_as_past_due(): void
mark_as_unpaid(): void
mark_as_expired(): void
update_status(status: SubscriptionStatus): void
update_period(start: Date, end: Date): void
apply_discount(discount_id: string): void
remove_discount(): void
extend_trial(days: number): void
update_payment_method(payment_method_id: string): void
is_active(): boolean
is_in_trial(): boolean
has_expired(): boolean
can_access_features(): boolean
```

---

### 2. `plan.entity.ts`

**Prefixo**: `plan`

**Propriedades**:
```typescript
type PlanEntityOwnProps = {
  name: string;                       // "Free", "Essential", "Pro"
  description?: string;
  price: number;                      // Em centavos
  currency: string;                   // "BRL", "USD"
  interval: RenewalInterval;          // monthly, yearly
  features: PlanFeatures;             // JSON com features habilitadas
  limits: PlanLimits;                 // JSON com limites
  trial_days?: number;                // Dias de trial padrão
  is_active: boolean;                 // Se o plano está disponível para venda
  metadata?: Record<string, any>;
};

type PlanFeatures = {
  advanced_booking: boolean;
  custom_branding: boolean;
  analytics: boolean;
  api_access: boolean;
  // ... adicionar conforme necessário
};

type PlanLimits = {
  max_bookings_per_month: number;
  max_concurrent_bookings: number;
  max_booking_rules: number;
  // ... adicionar conforme necessário
};
```

**Métodos de Negócio**:
```typescript
activate(): void
deactivate(): void
update_price(new_price: number): void
update_limits(new_limits: Partial<PlanLimits>): void
update_features(new_features: Partial<PlanFeatures>): void
has_feature(feature: keyof PlanFeatures): boolean
get_limit(limit: keyof PlanLimits): number
```

---

### 3. `invoice.entity.ts`

**Prefixo**: `inv`

**Propriedades**:
```typescript
type InvoiceEntityOwnProps = {
  user_id: string;                    // FK para User
  subscription_id: string;            // FK para Subscription
  amount: number;                     // Em centavos
  currency: string;                   // "BRL", "USD"
  status: InvoiceStatus;              // enum
  line_items: InvoiceLineItem[];      // Itens da fatura
  due_date: Date;
  paid_at?: Date;
  provider_invoice_id?: string;       // ID no provider externo
  metadata?: Record<string, any>;
};

enum InvoiceStatus {
  OPEN = 'open',
  PAID = 'paid',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void',
}

type InvoiceLineItem = {
  description: string;
  amount: number;
  quantity: number;
  metadata?: Record<string, any>;
};
```

**Métodos de Negócio**:
```typescript
mark_as_paid(paid_at: Date): void
mark_as_uncollectible(): void
mark_as_void(): void
is_overdue(): boolean
add_line_item(item: InvoiceLineItem): void
calculate_total(): number
```

---

### 4. `discount.entity.ts`

**Prefixo**: `disc`

**Propriedades**:
```typescript
type DiscountEntityOwnProps = {
  code: string;                       // Código do cupom (único)
  type: DiscountType;                 // enum
  value: number;                      // 20 (%), 1000 (centavos), 2 (meses)
  duration: DiscountDuration;         // enum
  repeating_count?: number;           // Quantas vezes repetir (se repeating)
  assigned_to_user_id?: string;       // Cupom exclusivo para user
  max_redemptions?: number;           // Limite de usos
  redemptions_count: number;          // Quantas vezes foi usado
  expires_at?: Date;                  // Data de expiração
  is_active: boolean;                 // Se o cupom está ativo
  metadata?: Record<string, any>;
};

enum DiscountType {
  PERCENTAGE = 'percentage',          // 20% de desconto
  FIXED = 'fixed',                    // R$10 de desconto
  FREE_PERIOD = 'free_period',        // 2 meses grátis
}

enum DiscountDuration {
  ONCE = 'once',                      // Aplica uma vez
  REPEATING = 'repeating',            // Aplica N vezes
  FOREVER = 'forever',                // Aplica para sempre
}
```

**Métodos de Negócio**:
```typescript
redeem(): void
can_be_redeemed(): boolean
is_expired(): boolean
is_valid_for_user(user_id: string): boolean
deactivate(): void
activate(): void
```

---

### 5. `coupon-redemption.entity.ts`

**Prefixo**: `cred`

**Propriedades**:
```typescript
type CouponRedemptionEntityOwnProps = {
  coupon_id: string;                  // FK para Discount
  user_id: string;                    // FK para User
  subscription_id: string;            // FK para Subscription
  redeemed_at: Date;
  metadata?: Record<string, any>;
};
```

**Métodos de Negócio**:
```typescript
// Entidade simples, sem métodos de negócio complexos
```

---

### 6. `payment-method.entity.ts`

**Prefixo**: `pm`

**Propriedades**:
```typescript
type PaymentMethodEntityOwnProps = {
  user_id: string;                    // FK para User
  provider_payment_method_id: string; // Token do provider
  type: PaymentMethodType;            // enum
  last_4_digits?: string;             // Últimos 4 dígitos do cartão
  brand?: string;                     // Visa, Mastercard, etc
  expiry_month?: number;
  expiry_year?: number;
  is_default: boolean;                // Método de pagamento padrão
  metadata?: Record<string, any>;
};

enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  PIX = 'pix',
}
```

**Métodos de Negócio**:
```typescript
set_as_default(): void
unset_as_default(): void
is_expired(): boolean
```

---

## 💎 Value Objects

### 1. `money.value-object.ts`

```typescript
export class Money {
  constructor(
    private readonly amount: number,    // Em centavos
    private readonly currency: string,  // "BRL", "USD"
  ) {
    if (amount < 0) {
      throw new InvalidMoneyError('Amount cannot be negative');
    }
  }

  get_amount(): number {
    return this.amount;
  }

  get_currency(): string {
    return this.currency;
  }

  to_string(): string {
    return `${this.currency} ${(this.amount / 100).toFixed(2)}`;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new InvalidMoneyError('Cannot add different currencies');
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new InvalidMoneyError('Cannot subtract different currencies');
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.amount * factor, this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }
}
```

---

## ⚠️ Domain Errors

Criar em `src/domain/errors/`:

```typescript
// subscription.errors.ts
export class SubscriptionNotFoundError extends DomainError {}
export class SubscriptionAlreadyActiveError extends DomainError {}
export class SubscriptionAlreadyCanceledError extends DomainError {}
export class SubscriptionCannotBeReactivatedError extends DomainError {}

// plan.errors.ts
export class PlanNotFoundError extends DomainError {}
export class PlanNotActiveError extends DomainError {}

// invoice.errors.ts
export class InvoiceNotFoundError extends DomainError {}
export class InvoiceAlreadyPaidError extends DomainError {}
export class InvoiceCannotBeModifiedError extends DomainError {}

// discount.errors.ts
export class DiscountNotFoundError extends DomainError {}
export class DiscountExpiredError extends DomainError {}
export class DiscountMaxRedemptionsReachedError extends DomainError {}
export class DiscountNotValidForUserError extends DomainError {}
export class DiscountAlreadyRedeemed extends DomainError {}

// payment-method.errors.ts
export class PaymentMethodNotFoundError extends DomainError {}
export class PaymentMethodExpiredError extends DomainError {}

// money.errors.ts
export class InvalidMoneyError extends DomainError {}

// payment.errors.ts
export class PaymentFailedError extends DomainError {}
export class PaymentProviderError extends DomainError {}
```

---

## 🔧 Domain Services

### 1. `subscription-lifecycle.service.ts`

Interface em `src/domain/services/`:

```typescript
export interface ISubscriptionLifecycleService {
  /**
   * Calcula o próximo período de cobrança
   */
  calculate_next_period(
    current_period_end: Date,
    interval: RenewalInterval,
  ): { start: Date; end: Date };

  /**
   * Calcula proration para upgrade/downgrade
   */
  calculate_proration(
    current_plan_price: number,
    new_plan_price: number,
    days_remaining: number,
    total_days_in_period: number,
  ): number;

  /**
   * Verifica se subscription pode ser reativada
   */
  can_reactivate(subscription: SubscriptionEntity): boolean;

  /**
   * Aplica retry policy (dunning)
   */
  should_retry_payment(
    subscription: SubscriptionEntity,
    retry_count: number,
  ): boolean;
}
```

### 2. `plan-limits-validator.service.ts`

```typescript
export interface IPlanLimitsValidatorService {
  /**
   * Valida se o user ainda tem limite para criar booking
   */
  can_create_booking(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    current_bookings_count: number,
  ): boolean;

  /**
   * Valida se o user pode acessar uma feature
   */
  has_feature_access(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    feature: string,
  ): boolean;

  /**
   * Retorna limite restante
   */
  get_remaining_limit(
    subscription: SubscriptionEntity,
    plan: PlanEntity,
    limit_key: string,
    current_usage: number,
  ): number;
}
```

---

## 📦 Repository Interfaces

Criar em `src/application/contracts/`:

### 1. `i-subscription-repository.interface.ts`

```typescript
export interface ISubscriptionRepository {
  create(entity: SubscriptionEntity): Promise<SubscriptionEntity>;
  find_by_id(id: string): Promise<SubscriptionEntity | null>;
  find_by_user_id(user_id: string): Promise<SubscriptionEntity | null>;
  find_by_provider_id(provider_id: string): Promise<SubscriptionEntity | null>;
  update(entity: SubscriptionEntity): Promise<SubscriptionEntity>;
  delete(id: string): Promise<boolean>;

  // Métodos específicos
  find_expiring_trials(days: number): Promise<SubscriptionEntity[]>;
  find_by_status(status: SubscriptionStatus): Promise<SubscriptionEntity[]>;
}
```

### 2. `i-plan-repository.interface.ts`

```typescript
export interface IPlanRepository {
  create(entity: PlanEntity): Promise<PlanEntity>;
  find_by_id(id: string): Promise<PlanEntity | null>;
  find_by_name(name: string): Promise<PlanEntity | null>;
  list_active(): Promise<PlanEntity[]>;
  update(entity: PlanEntity): Promise<PlanEntity>;
  delete(id: string): Promise<boolean>;
}
```

### 3. `i-invoice-repository.interface.ts`

```typescript
export interface IInvoiceRepository {
  create(entity: InvoiceEntity): Promise<InvoiceEntity>;
  find_by_id(id: string): Promise<InvoiceEntity | null>;
  find_by_subscription_id(subscription_id: string): Promise<InvoiceEntity[]>;
  find_by_user_id(user_id: string): Promise<InvoiceEntity[]>;
  find_by_provider_id(provider_id: string): Promise<InvoiceEntity | null>;
  update(entity: InvoiceEntity): Promise<InvoiceEntity>;
  delete(id: string): Promise<boolean>;

  // Métodos específicos
  find_overdue(): Promise<InvoiceEntity[]>;
  find_unpaid_by_user(user_id: string): Promise<InvoiceEntity[]>;
}
```

### 4. `i-discount-repository.interface.ts`

```typescript
export interface IDiscountRepository {
  create(entity: DiscountEntity): Promise<DiscountEntity>;
  find_by_id(id: string): Promise<DiscountEntity | null>;
  find_by_code(code: string): Promise<DiscountEntity | null>;
  list_active(): Promise<DiscountEntity[]>;
  update(entity: DiscountEntity): Promise<DiscountEntity>;
  delete(id: string): Promise<boolean>;
}
```

### 5. `i-coupon-redemption-repository.interface.ts`

```typescript
export interface ICouponRedemptionRepository {
  create(entity: CouponRedemptionEntity): Promise<CouponRedemptionEntity>;
  find_by_user_and_coupon(
    user_id: string,
    coupon_id: string,
  ): Promise<CouponRedemptionEntity | null>;
  list_by_user(user_id: string): Promise<CouponRedemptionEntity[]>;
  list_by_coupon(coupon_id: string): Promise<CouponRedemptionEntity[]>;
}
```

### 6. `i-payment-method-repository.interface.ts`

```typescript
export interface IPaymentMethodRepository {
  create(entity: PaymentMethodEntity): Promise<PaymentMethodEntity>;
  find_by_id(id: string): Promise<PaymentMethodEntity | null>;
  find_by_user_id(user_id: string): Promise<PaymentMethodEntity[]>;
  find_default_by_user_id(user_id: string): Promise<PaymentMethodEntity | null>;
  update(entity: PaymentMethodEntity): Promise<PaymentMethodEntity>;
  delete(id: string): Promise<boolean>;
}
```

---

## 🎬 Use Cases

### Subscription Use Cases

#### 1. `create-subscription.usecase.ts`

```typescript
class UseCase {
  constructor(
    private readonly subscription_repository: ISubscriptionRepository,
    private readonly plan_repository: IPlanRepository,
    private readonly discount_repository: IDiscountRepository,
    private readonly payment_gateway: IPaymentGateway,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Validar se já existe subscription ativa
    // 2. Buscar plano
    // 3. Aplicar cupom se fornecido
    // 4. Criar subscription no provider
    // 5. Criar subscription localmente
    // 6. Criar invoice inicial (se não for trial/free)
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    plan_id: string;
    payment_method_id?: string;
    coupon_code?: string;
  };
  export type Output = Promise<SubscriptionEntity>;
}
```

#### 2. `cancel-subscription.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar subscription
    // 2. Validar se pode cancelar
    // 3. Cancelar no provider
    // 4. Atualizar localmente
  }
}

declare namespace UseCase {
  export type Input = {
    subscription_id: string;
    cancel_immediately: boolean;
  };
  export type Output = Promise<SubscriptionEntity>;
}
```

#### 3. `reactivate-subscription.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar subscription
    // 2. Validar se pode reativar
    // 3. Reativar no provider
    // 4. Atualizar localmente
  }
}
```

#### 4. `change-subscription-plan.usecase.ts`

```typescript
class UseCase {
  constructor(
    private readonly subscription_repository: ISubscriptionRepository,
    private readonly plan_repository: IPlanRepository,
    private readonly lifecycle_service: ISubscriptionLifecycleService,
    private readonly payment_gateway: IPaymentGateway,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar subscription e novos plan
    // 2. Calcular proration
    // 3. Atualizar no provider
    // 4. Atualizar localmente
    // 5. Criar invoice se upgrade imediato
  }
}

declare namespace UseCase {
  export type Input = {
    subscription_id: string;
    new_plan_id: string;
    prorate: boolean;
  };
  export type Output = Promise<SubscriptionEntity>;
}
```

#### 5. `get-subscription-by-user.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // Buscar subscription ativa do user
  }
}
```

### Discount Use Cases

#### 6. `create-discount.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Validar código único
    // 2. Criar discount
  }
}

declare namespace UseCase {
  export type Input = {
    code: string;
    type: DiscountType;
    value: number;
    duration: DiscountDuration;
    repeating_count?: number;
    assigned_to_user_id?: string;
    max_redemptions?: number;
    expires_at?: Date;
  };
  export type Output = Promise<DiscountEntity>;
}
```

#### 7. `apply-discount-to-subscription.usecase.ts`

```typescript
class UseCase {
  constructor(
    private readonly subscription_repository: ISubscriptionRepository,
    private readonly discount_repository: IDiscountRepository,
    private readonly coupon_redemption_repository: ICouponRedemptionRepository,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar discount
    // 2. Validar se pode ser aplicado
    // 3. Aplicar na subscription
    // 4. Criar coupon_redemption
  }
}

declare namespace UseCase {
  export type Input = {
    subscription_id: string;
    coupon_code: string;
  };
  export type Output = Promise<SubscriptionEntity>;
}
```

#### 8. `validate-discount-code.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // Valida se cupom existe, está ativo e pode ser usado
  }
}

declare namespace UseCase {
  export type Input = {
    code: string;
    user_id?: string;
  };
  export type Output = Promise<{
    valid: boolean;
    discount?: DiscountEntity;
    error?: string;
  }>;
}
```

### Invoice Use Cases

#### 9. `create-invoice.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Criar invoice no provider
    // 2. Criar invoice localmente
  }
}
```

#### 10. `pay-invoice.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Processar pagamento via gateway
    // 2. Atualizar invoice
    // 3. Atualizar subscription
  }
}
```

#### 11. `list-invoices-by-user.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // Listar todas as invoices do user
  }
}
```

### Payment Method Use Cases

#### 12. `add-payment-method.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Criar payment method no provider
    // 2. Salvar token localmente
  }
}
```

#### 13. `update-subscription-payment-method.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Atualizar no provider
    // 2. Atualizar subscription
  }
}
```

### Plan Use Cases

#### 14. `create-plan.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // Criar plano (admin only)
  }
}
```

#### 15. `list-active-plans.usecase.ts`

```typescript
class UseCase {
  async execute(): UseCase.Output {
    // Listar planos ativos disponíveis
  }
}
```

#### 16. `get-plan-by-id.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // Buscar plano por ID
  }
}
```

### Subscription Guards

#### 17. `check-subscription-access.usecase.ts`

```typescript
class UseCase {
  constructor(
    private readonly subscription_repository: ISubscriptionRepository,
    private readonly plan_repository: IPlanRepository,
    private readonly limits_validator: IPlanLimitsValidatorService,
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar subscription do user
    // 2. Validar se subscription está ativa
    // 3. Validar se tem acesso à feature
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    feature: string;
  };
  export type Output = Promise<{
    has_access: boolean;
    reason?: string;
  }>;
}
```

#### 18. `check-subscription-limit.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // Verifica se user ainda tem limite disponível
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    limit_key: string;
    current_usage: number;
  };
  export type Output = Promise<{
    has_limit: boolean;
    remaining: number;
    total: number;
  }>;
}
```

### Webhook Use Cases

#### 19. `handle-subscription-updated-webhook.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar subscription por provider_id
    // 2. Atualizar status e dados
  }
}

declare namespace UseCase {
  export type Input = {
    provider_subscription_id: string;
    status: SubscriptionStatus;
    current_period_start: Date;
    current_period_end: Date;
    metadata?: Record<string, any>;
  };
  export type Output = Promise<void>;
}
```

#### 20. `handle-invoice-paid-webhook.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar invoice por provider_id
    // 2. Marcar como paga
    // 3. Ativar subscription se necessário
  }
}
```

#### 21. `handle-payment-failed-webhook.usecase.ts`

```typescript
class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Buscar invoice e subscription
    // 2. Marcar subscription como past_due
    // 3. Iniciar retry logic (dunning)
  }
}
```

---

## 💳 Payment Gateway (Interface)

### Interface Abstrata

Criar em `src/domain/services/`:

```typescript
// i-payment-gateway.service.ts

export interface IPaymentGateway {
  /**
   * Cria uma subscription no provider
   */
  create_subscription(params: CreateSubscriptionParams): Promise<ProviderSubscription>;

  /**
   * Atualiza subscription no provider
   */
  update_subscription(
    subscription_id: string,
    params: UpdateSubscriptionParams,
  ): Promise<ProviderSubscription>;

  /**
   * Cancela subscription no provider
   */
  cancel_subscription(
    subscription_id: string,
    cancel_at_period_end: boolean,
  ): Promise<ProviderSubscription>;

  /**
   * Reativa subscription no provider
   */
  reactivate_subscription(subscription_id: string): Promise<ProviderSubscription>;

  /**
   * Cria invoice no provider
   */
  create_invoice(params: CreateInvoiceParams): Promise<ProviderInvoice>;

  /**
   * Paga invoice no provider
   */
  pay_invoice(invoice_id: string, payment_method_id: string): Promise<ProviderInvoice>;

  /**
   * Adiciona payment method no provider
   */
  attach_payment_method(
    user_id: string,
    payment_method_token: string,
  ): Promise<ProviderPaymentMethod>;

  /**
   * Remove payment method no provider
   */
  detach_payment_method(payment_method_id: string): Promise<void>;

  /**
   * Verifica assinatura do webhook
   */
  verify_webhook_signature(payload: string, signature: string): boolean;

  /**
   * Parseia evento do webhook
   */
  parse_webhook_event(payload: string): WebhookEvent;
}

// Types

export type CreateSubscriptionParams = {
  user_id: string;
  plan_id: string;
  payment_method_id?: string;
  trial_end?: Date;
  metadata?: Record<string, any>;
};

export type UpdateSubscriptionParams = {
  plan_id?: string;
  payment_method_id?: string;
  cancel_at_period_end?: boolean;
  metadata?: Record<string, any>;
};

export type CreateInvoiceParams = {
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  description: string;
  due_date: Date;
  metadata?: Record<string, any>;
};

export type ProviderSubscription = {
  id: string;
  status: string;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  trial_end?: Date;
  metadata?: Record<string, any>;
};

export type ProviderInvoice = {
  id: string;
  amount: number;
  status: string;
  paid_at?: Date;
  metadata?: Record<string, any>;
};

export type ProviderPaymentMethod = {
  id: string;
  type: string;
  last_4_digits?: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
};

export type WebhookEvent = {
  type: WebhookEventType;
  data: Record<string, any>;
};

export enum WebhookEventType {
  SUBSCRIPTION_CREATED = 'subscription.created',
  SUBSCRIPTION_UPDATED = 'subscription.updated',
  SUBSCRIPTION_CANCELED = 'subscription.canceled',
  INVOICE_PAID = 'invoice.paid',
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
  PAYMENT_METHOD_ATTACHED = 'payment_method.attached',
  PAYMENT_METHOD_DETACHED = 'payment_method.detached',
}
```

### Implementação Fake (Para Testes)

Criar em `src/infra/services/`:

```typescript
// fake-payment-gateway.service.ts

export class FakePaymentGateway implements IPaymentGateway {
  private subscriptions = new Map<string, ProviderSubscription>();
  private invoices = new Map<string, ProviderInvoice>();
  private payment_methods = new Map<string, ProviderPaymentMethod>();

  async create_subscription(params: CreateSubscriptionParams): Promise<ProviderSubscription> {
    const subscription: ProviderSubscription = {
      id: `fake_sub_${Date.now()}`,
      status: 'active',
      current_period_start: new Date(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      cancel_at_period_end: false,
      trial_end: params.trial_end,
      metadata: params.metadata,
    };

    this.subscriptions.set(subscription.id, subscription);
    return subscription;
  }

  // ... implementar outros métodos
}
```

---

## 📤 DTOs e Mappers

### Subscription DTOs

```typescript
// src/application/dtos/subscription.dto.ts

export interface SubscriptionDTO {
  id: string;
  user_id: string;
  plan_id: string;
  status: string;
  start_date: Date;
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at?: Date;
  trial_end?: Date;
  renewal_interval: string;
  created_at: Date;
}

export interface SubscriptionWithPlanDTO extends SubscriptionDTO {
  plan: PlanDTO;
}

export interface SubscriptionWithDiscountDTO extends SubscriptionDTO {
  discount?: DiscountDTO;
}
```

```typescript
// src/application/dtos/mappers/subscription.mapper.ts

export class SubscriptionMapper {
  static toDTO(entity: SubscriptionEntity): SubscriptionDTO {
    return {
      id: entity.id,
      user_id: entity.user_id,
      plan_id: entity.plan_id,
      status: entity.status,
      start_date: entity.start_date,
      current_period_start: entity.current_period_start,
      current_period_end: entity.current_period_end,
      cancel_at_period_end: entity.cancel_at_period_end,
      canceled_at: entity.canceled_at,
      trial_end: entity.trial_end,
      renewal_interval: entity.renewal_interval,
      created_at: entity.created_at,
    };
  }

  static toWithPlan(
    entity: SubscriptionEntity,
    plan: PlanEntity,
  ): SubscriptionWithPlanDTO {
    return {
      ...this.toDTO(entity),
      plan: PlanMapper.toDTO(plan),
    };
  }

  static toWithDiscount(
    entity: SubscriptionEntity,
    discount?: DiscountEntity,
  ): SubscriptionWithDiscountDTO {
    return {
      ...this.toDTO(entity),
      discount: discount ? DiscountMapper.toDTO(discount) : undefined,
    };
  }
}
```

### Plan DTOs

```typescript
// src/application/dtos/plan.dto.ts

export interface PlanDTO {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  interval: string;
  features: Record<string, boolean>;
  limits: Record<string, number>;
  trial_days?: number;
  is_active: boolean;
}
```

### Invoice DTOs

```typescript
// src/application/dtos/invoice.dto.ts

export interface InvoiceDTO {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: string;
  line_items: InvoiceLineItem[];
  due_date: Date;
  paid_at?: Date;
  created_at: Date;
}

export interface InvoiceListItemDTO {
  id: string;
  amount: number;
  status: string;
  due_date: Date;
  paid_at?: Date;
}
```

### Discount DTOs

```typescript
// src/application/dtos/discount.dto.ts

export interface DiscountDTO {
  id: string;
  code: string;
  type: string;
  value: number;
  duration: string;
  expires_at?: Date;
  is_active: boolean;
}

export interface DiscountValidationDTO {
  valid: boolean;
  discount?: DiscountDTO;
  error?: string;
}
```

---

## 🛣️ Controllers e Routes

### Subscription Controller

```typescript
// src/infra/http/controllers/subscription.controller.ts

const CreateSubscriptionSchema = z.object({
  plan_id: z.string().min(1),
  payment_method_id: z.string().optional(),
  coupon_code: z.string().optional(),
});

const ChangeSubscriptionPlanSchema = z.object({
  new_plan_id: z.string().min(1),
  prorate: z.boolean().default(true),
});

export class SubscriptionController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const body = await c.req.json();
    const payload = CreateSubscriptionSchema.parse(body);

    const subscription = await this.container.use_cases.create_subscription.execute({
      user_id: auth.userId,
      plan_id: payload.plan_id,
      payment_method_id: payload.payment_method_id,
      coupon_code: payload.coupon_code,
    });

    return c.json(SubscriptionMapper.toDTO(subscription), 201);
  }

  async get_my_subscription(c: Context) {
    const auth = c.get('auth') as AuthContext;

    const subscription =
      await this.container.use_cases.get_subscription_by_user.execute({
        user_id: auth.userId,
      });

    if (!subscription) {
      throw new NotFoundError('Subscription not found');
    }

    const plan = await this.container.use_cases.get_plan_by_id.execute({
      id: subscription.plan_id,
    });

    return c.json(SubscriptionMapper.toWithPlan(subscription, plan!));
  }

  async cancel(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const { cancel_immediately } = c.req.query();

    const subscription = await this.container.use_cases.cancel_subscription.execute({
      user_id: auth.userId,
      cancel_immediately: cancel_immediately === 'true',
    });

    return c.json(SubscriptionMapper.toDTO(subscription));
  }

  async reactivate(c: Context) {
    const auth = c.get('auth') as AuthContext;

    const subscription =
      await this.container.use_cases.reactivate_subscription.execute({
        user_id: auth.userId,
      });

    return c.json(SubscriptionMapper.toDTO(subscription));
  }

  async change_plan(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const body = await c.req.json();
    const payload = ChangeSubscriptionPlanSchema.parse(body);

    const subscription =
      await this.container.use_cases.change_subscription_plan.execute({
        user_id: auth.userId,
        new_plan_id: payload.new_plan_id,
        prorate: payload.prorate,
      });

    return c.json(SubscriptionMapper.toDTO(subscription));
  }
}
```

### Plan Controller

```typescript
// src/infra/http/controllers/plan.controller.ts

export class PlanController {
  constructor(private readonly container: Container) {}

  async list_active(c: Context) {
    const plans = await this.container.use_cases.list_active_plans.execute();

    return c.json({
      items: plans.map(PlanMapper.toDTO),
      total: plans.length,
    });
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const plan = await this.container.use_cases.get_plan_by_id.execute({ id });

    if (!plan) {
      throw new NotFoundError('Plan not found');
    }

    return c.json(PlanMapper.toDTO(plan));
  }
}
```

### Invoice Controller

```typescript
// src/infra/http/controllers/invoice.controller.ts

export class InvoiceController {
  constructor(private readonly container: Container) {}

  async list_my_invoices(c: Context) {
    const auth = c.get('auth') as AuthContext;

    const invoices = await this.container.use_cases.list_invoices_by_user.execute({
      user_id: auth.userId,
    });

    return c.json({
      items: invoices.map(InvoiceMapper.toListItem),
      total: invoices.length,
    });
  }

  async get_by_id(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const { id } = c.req.param();

    const invoice = await this.container.use_cases.get_invoice_by_id.execute({ id });

    if (!invoice || invoice.user_id !== auth.userId) {
      throw new NotFoundError('Invoice not found');
    }

    return c.json(InvoiceMapper.toDTO(invoice));
  }
}
```

### Discount Controller

```typescript
// src/infra/http/controllers/discount.controller.ts

export class DiscountController {
  constructor(private readonly container: Container) {}

  async validate_code(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const { code } = c.req.param();

    const result = await this.container.use_cases.validate_discount_code.execute({
      code,
      user_id: auth.userId,
    });

    return c.json(result);
  }

  async apply_to_subscription(c: Context) {
    const auth = c.get('auth') as AuthContext;
    const { code } = await c.req.json();

    const subscription =
      await this.container.use_cases.apply_discount_to_subscription.execute({
        user_id: auth.userId,
        coupon_code: code,
      });

    return c.json(SubscriptionMapper.toDTO(subscription));
  }
}
```

### Webhook Controller

```typescript
// src/infra/http/controllers/webhook.controller.ts

export class WebhookController {
  constructor(private readonly container: Container) {}

  async handle_payment_provider(c: Context) {
    const signature = c.req.header('x-webhook-signature');
    const payload = await c.req.text();

    // 1. Verificar assinatura
    const is_valid = this.container.services.payment_gateway.verify_webhook_signature(
      payload,
      signature!,
    );

    if (!is_valid) {
      throw new UnauthorizedError('Invalid webhook signature');
    }

    // 2. Parsear evento
    const event = this.container.services.payment_gateway.parse_webhook_event(payload);

    // 3. Processar evento
    switch (event.type) {
      case WebhookEventType.SUBSCRIPTION_UPDATED:
        await this.container.use_cases.handle_subscription_updated_webhook.execute(
          event.data,
        );
        break;

      case WebhookEventType.INVOICE_PAID:
        await this.container.use_cases.handle_invoice_paid_webhook.execute(
          event.data,
        );
        break;

      case WebhookEventType.INVOICE_PAYMENT_FAILED:
        await this.container.use_cases.handle_payment_failed_webhook.execute(
          event.data,
        );
        break;

      default:
        console.log(`Unhandled webhook event: ${event.type}`);
    }

    return c.json({ received: true }, 200);
  }
}
```

### Routes

```typescript
// src/infra/http/routes/subscription.routes.ts

export function createSubscriptionRoutes(container: Container) {
  const router = new Hono();
  const controller = new SubscriptionController(container);

  router.post('/', authMiddleware, (c) => controller.create(c));
  router.get('/me', authMiddleware, (c) => controller.get_my_subscription(c));
  router.post('/cancel', authMiddleware, (c) => controller.cancel(c));
  router.post('/reactivate', authMiddleware, (c) => controller.reactivate(c));
  router.post('/change-plan', authMiddleware, (c) => controller.change_plan(c));

  return router;
}

// src/infra/http/routes/plan.routes.ts

export function createPlanRoutes(container: Container) {
  const router = new Hono();
  const controller = new PlanController(container);

  router.get('/', (c) => controller.list_active(c));
  router.get('/:id', (c) => controller.get_by_id(c));

  return router;
}

// src/infra/http/routes/invoice.routes.ts

export function createInvoiceRoutes(container: Container) {
  const router = new Hono();
  const controller = new InvoiceController(container);

  router.get('/', authMiddleware, (c) => controller.list_my_invoices(c));
  router.get('/:id', authMiddleware, (c) => controller.get_by_id(c));

  return router;
}

// src/infra/http/routes/discount.routes.ts

export function createDiscountRoutes(container: Container) {
  const router = new Hono();
  const controller = new DiscountController(container);

  router.get('/validate/:code', authMiddleware, (c) => controller.validate_code(c));
  router.post('/apply', authMiddleware, (c) => controller.apply_to_subscription(c));

  return router;
}

// src/infra/http/routes/webhook.routes.ts

export function createWebhookRoutes(container: Container) {
  const router = new Hono();
  const controller = new WebhookController(container);

  router.post('/payment-provider', (c) => controller.handle_payment_provider(c));

  return router;
}
```

Registrar no `routes/index.ts`:

```typescript
export function createRoutes(container: Container) {
  const app = new Hono();

  app.route('/users', createUserRoutes(container));
  app.route('/auth', createAuthRoutes(container));
  app.route('/bookings', createBookingRoutes(container));

  // Billing routes
  app.route('/subscriptions', createSubscriptionRoutes(container));
  app.route('/plans', createPlanRoutes(container));
  app.route('/invoices', createInvoiceRoutes(container));
  app.route('/discounts', createDiscountRoutes(container));
  app.route('/webhooks', createWebhookRoutes(container));

  return app;
}
```

---

## 🔌 Dependency Injection

### Repositories Factory

```typescript
// src/infra/di/factories/repositories.factory.ts

export function createRepositories(_clients: Clients) {
  return {
    // ... existing repositories

    // Billing repositories
    subscription_repository: new InMemorySubscriptionRepository(),
    plan_repository: new InMemoryPlanRepository(),
    invoice_repository: new InMemoryInvoiceRepository(),
    discount_repository: new InMemoryDiscountRepository(),
    coupon_redemption_repository: new InMemoryCouponRedemptionRepository(),
    payment_method_repository: new InMemoryPaymentMethodRepository(),
  };
}
```

### Services Factory

```typescript
// src/infra/di/factories/services.factory.ts

export function createServices() {
  return {
    // ... existing services

    // Billing services
    payment_gateway: new FakePaymentGateway(),
    subscription_lifecycle_service: new SubscriptionLifecycleService(),
    plan_limits_validator_service: new PlanLimitsValidatorService(),
  };
}
```

### Use Cases Factory

```typescript
// src/infra/di/factories/use-cases.factory.ts

export function createUseCases(
  repositories: Repositories,
  services: Services,
) {
  return {
    // ... existing use cases

    // Subscription use cases
    create_subscription: new CreateSubscriptionUseCase(
      repositories.subscription_repository,
      repositories.plan_repository,
      repositories.discount_repository,
      services.payment_gateway,
    ),
    cancel_subscription: new CancelSubscriptionUseCase(
      repositories.subscription_repository,
      services.payment_gateway,
    ),
    reactivate_subscription: new ReactivateSubscriptionUseCase(
      repositories.subscription_repository,
      services.payment_gateway,
    ),
    change_subscription_plan: new ChangeSubscriptionPlanUseCase(
      repositories.subscription_repository,
      repositories.plan_repository,
      services.subscription_lifecycle_service,
      services.payment_gateway,
    ),
    get_subscription_by_user: new GetSubscriptionByUserUseCase(
      repositories.subscription_repository,
    ),

    // Plan use cases
    create_plan: new CreatePlanUseCase(repositories.plan_repository),
    list_active_plans: new ListActivePlansUseCase(repositories.plan_repository),
    get_plan_by_id: new GetPlanByIdUseCase(repositories.plan_repository),

    // Invoice use cases
    create_invoice: new CreateInvoiceUseCase(
      repositories.invoice_repository,
      services.payment_gateway,
    ),
    list_invoices_by_user: new ListInvoicesByUserUseCase(
      repositories.invoice_repository,
    ),
    get_invoice_by_id: new GetInvoiceByIdUseCase(repositories.invoice_repository),

    // Discount use cases
    create_discount: new CreateDiscountUseCase(repositories.discount_repository),
    apply_discount_to_subscription: new ApplyDiscountToSubscriptionUseCase(
      repositories.subscription_repository,
      repositories.discount_repository,
      repositories.coupon_redemption_repository,
    ),
    validate_discount_code: new ValidateDiscountCodeUseCase(
      repositories.discount_repository,
    ),

    // Payment Method use cases
    add_payment_method: new AddPaymentMethodUseCase(
      repositories.payment_method_repository,
      services.payment_gateway,
    ),
    update_subscription_payment_method: new UpdateSubscriptionPaymentMethodUseCase(
      repositories.subscription_repository,
      services.payment_gateway,
    ),

    // Subscription Guards
    check_subscription_access: new CheckSubscriptionAccessUseCase(
      repositories.subscription_repository,
      repositories.plan_repository,
      services.plan_limits_validator_service,
    ),
    check_subscription_limit: new CheckSubscriptionLimitUseCase(
      repositories.subscription_repository,
      repositories.plan_repository,
      services.plan_limits_validator_service,
    ),

    // Webhook use cases
    handle_subscription_updated_webhook: new HandleSubscriptionUpdatedWebhookUseCase(
      repositories.subscription_repository,
    ),
    handle_invoice_paid_webhook: new HandleInvoicePaidWebhookUseCase(
      repositories.invoice_repository,
      repositories.subscription_repository,
    ),
    handle_payment_failed_webhook: new HandlePaymentFailedWebhookUseCase(
      repositories.invoice_repository,
      repositories.subscription_repository,
    ),
  };
}
```

---

## 🧪 Testes

### Testes Unitários

#### Exemplo: `create-subscription.usecase.spec.ts`

```typescript
describe('CreateSubscriptionUseCase', () => {
  let sut: CreateSubscriptionUseCase;
  let subscription_repository: InMemorySubscriptionRepository;
  let plan_repository: InMemoryPlanRepository;
  let discount_repository: InMemoryDiscountRepository;
  let payment_gateway: FakePaymentGateway;

  beforeEach(() => {
    subscription_repository = new InMemorySubscriptionRepository();
    plan_repository = new InMemoryPlanRepository();
    discount_repository = new InMemoryDiscountRepository();
    payment_gateway = new FakePaymentGateway();

    sut = new CreateSubscriptionUseCase(
      subscription_repository,
      plan_repository,
      discount_repository,
      payment_gateway,
    );
  });

  it('should create a new subscription', async () => {
    // Arrange
    const plan = new PlanEntity({
      name: 'Pro',
      price: 4900,
      currency: 'BRL',
      interval: RenewalInterval.MONTHLY,
      features: {},
      limits: {},
    });
    await plan_repository.create(plan);

    // Act
    const subscription = await sut.execute({
      user_id: 'user_123',
      plan_id: plan.id,
      payment_method_id: 'pm_123',
    });

    // Assert
    expect(subscription.user_id).toBe('user_123');
    expect(subscription.plan_id).toBe(plan.id);
    expect(subscription.status).toBe(SubscriptionStatus.ACTIVE);
    expect(subscription.id).toContain('sub_');
  });

  it('should apply discount if coupon code is provided', async () => {
    // ... test
  });

  it('should throw error if plan not found', async () => {
    // ... test
  });
});
```

### Testes E2E

#### Exemplo: `subscription.e2e.spec.ts`

```typescript
describe('Subscription E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/subscriptions', () => {
    it('should create subscription successfully', async () => {
      // 1. Create user and authenticate
      // 2. Create plan
      // 3. Create subscription
      // 4. Validate response
    });

    it('should apply coupon if valid code is provided', async () => {
      // ... test
    });
  });

  describe('GET /api/subscriptions/me', () => {
    it('should return current user subscription', async () => {
      // ... test
    });
  });
});
```

---

## 🚀 Ordem de Implementação

### **Fase 1: Fundação (Entities + Errors)**

1. ✅ Criar `base-entity.ts` (já existe)
2. ✅ Criar todos os **Domain Errors**
3. ✅ Criar **Value Object** `Money`
4. ✅ Criar entidade `Plan`
5. ✅ Criar entidade `Subscription`
6. ✅ Criar entidade `Invoice`
7. ✅ Criar entidade `Discount`
8. ✅ Criar entidade `CouponRedemption`
9. ✅ Criar entidade `PaymentMethod`

### **Fase 2: Domain Services + Interfaces**

10. ✅ Criar interface `IPaymentGateway`
11. ✅ Criar interface `ISubscriptionLifecycleService`
12. ✅ Criar interface `IPlanLimitsValidatorService`
13. ✅ Implementar `FakePaymentGateway`
14. ✅ Implementar `SubscriptionLifecycleService`
15. ✅ Implementar `PlanLimitsValidatorService`

### **Fase 3: Repository Interfaces + Implementations**

16. ✅ Criar interface `IPlanRepository`
17. ✅ Criar interface `ISubscriptionRepository`
18. ✅ Criar interface `IInvoiceRepository`
19. ✅ Criar interface `IDiscountRepository`
20. ✅ Criar interface `ICouponRedemptionRepository`
21. ✅ Criar interface `IPaymentMethodRepository`
22. ✅ Implementar **Data Mappers** (in-memory)
23. ✅ Implementar **In-Memory Repositories**

### **Fase 4: Use Cases (Core)**

24. ✅ `CreatePlanUseCase`
25. ✅ `ListActivePlansUseCase`
26. ✅ `GetPlanByIdUseCase`
27. ✅ `CreateSubscriptionUseCase`
28. ✅ `GetSubscriptionByUserUseCase`
29. ✅ `CancelSubscriptionUseCase`
30. ✅ `ReactivateSubscriptionUseCase`
31. ✅ `ChangeSubscriptionPlanUseCase`

### **Fase 5: Use Cases (Discounts)**

32. ✅ `CreateDiscountUseCase`
33. ✅ `ValidateDiscountCodeUseCase`
34. ✅ `ApplyDiscountToSubscriptionUseCase`

### **Fase 6: Use Cases (Invoices)**

35. ✅ `CreateInvoiceUseCase`
36. ✅ `ListInvoicesByUserUseCase`
37. ✅ `GetInvoiceByIdUseCase`
38. ✅ `PayInvoiceUseCase`

### **Fase 7: Use Cases (Payment Methods)**

39. ✅ `AddPaymentMethodUseCase`
40. ✅ `UpdateSubscriptionPaymentMethodUseCase`

### **Fase 8: Use Cases (Subscription Guards)**

41. ✅ `CheckSubscriptionAccessUseCase`
42. ✅ `CheckSubscriptionLimitUseCase`

### **Fase 9: Use Cases (Webhooks)**

43. ✅ `HandleSubscriptionUpdatedWebhookUseCase`
44. ✅ `HandleInvoicePaidWebhookUseCase`
45. ✅ `HandlePaymentFailedWebhookUseCase`

### **Fase 10: DTOs e Mappers**

46. ✅ Criar todos os **DTOs**
47. ✅ Criar todos os **Mappers**

### **Fase 11: Controllers + Routes**

48. ✅ `SubscriptionController`
49. ✅ `PlanController`
50. ✅ `InvoiceController`
51. ✅ `DiscountController`
52. ✅ `WebhookController`
53. ✅ Criar **Routes**
54. ✅ Registrar routes no `routes/index.ts`

### **Fase 12: Dependency Injection**

55. ✅ Atualizar `repositories.factory.ts`
56. ✅ Atualizar `services.factory.ts`
57. ✅ Atualizar `use-cases.factory.ts`

### **Fase 13: Testes**

58. ✅ Escrever **testes unitários** para todas as entidades
59. ✅ Escrever **testes unitários** para todos os use cases
60. ✅ Escrever **testes E2E** para todos os endpoints

### **Fase 14: Documentação**

61. ✅ Documentar fluxos de negócio
62. ✅ Documentar integração com payment gateway
63. ✅ Documentar webhooks

---

## 🎁 Fluxos Completos

### **Fluxo 1: Criar assinatura com cupom de 2 meses grátis**

```
1. User clica em "Assinar Pro"
2. Frontend envia: { plan_id, coupon_code: "2MESES" }
3. Backend valida cupom
4. Backend cria subscription com trial_end = hoje + 2 meses
5. Backend registra coupon_redemption
6. Backend retorna subscription (status: trialing)
7. Após 2 meses, webhook "trial.ending" é disparado
8. Backend gera invoice e cobra
9. Se pagamento OK, subscription vira "active"
```

### **Fluxo 2: Upgrade de plano (imediato)**

```
1. User clica em "Upgrade para Pro"
2. Frontend envia: { new_plan_id, prorate: true }
3. Backend calcula proration
4. Backend cria invoice com valor proporcional
5. Backend cobra invoice
6. Se pagamento OK, subscription é atualizada
7. Webhook confirma atualização
```

### **Fluxo 3: Cancelamento ao fim do período**

```
1. User clica em "Cancelar assinatura"
2. Frontend envia: { cancel_immediately: false }
3. Backend atualiza subscription: cancel_at_period_end = true
4. Backend atualiza no provider
5. Webhook confirma atualização
6. No fim do período, webhook "subscription.canceled" é disparado
7. Backend marca subscription como "canceled"
```

### **Fluxo 4: Falha de pagamento + Dunning**

```
1. Chega a data de cobrança
2. Provider tenta cobrar
3. Pagamento falha
4. Webhook "invoice.payment_failed" é disparado
5. Backend marca subscription como "past_due"
6. Backend agenda retry após 24h
7. Se retry falhar novamente, agenda após 72h
8. Se retry final falhar, marca subscription como "unpaid"
9. Após X dias, cancela automaticamente
```

---

## 📝 Notas Finais

### ✅ Princípios Seguidos

1. **Clean Architecture**: Camadas bem separadas (Domain → Application → Infra)
2. **DDD**: Entidades ricas com regras de negócio
3. **SOLID**: Interfaces abstratas, inversão de dependência
4. **Provider-agnostic**: Gateway de pagamento é uma interface
5. **Webhook-driven**: Fonte da verdade vem do provider
6. **Testabilidade**: Tudo testável com in-memory e fakes

### 🔒 Segurança

- **PCI-DSS**: Delegado ao provider (nunca armazenar dados de cartão)
- **Tokens**: Usar tokens do provider para payment methods
- **Idempotência**: Operações críticas com idempotency keys
- **Webhook signature**: Sempre validar assinatura
- **Rate limiting**: Proteger endpoints sensíveis

### 🚨 Pontos de Atenção

1. **Sincronização**: Webhook é fonte da verdade, mas pode haver atrasos
2. **Proration**: Cuidado com cálculos de proporcionalidade
3. **Timezone**: Sempre usar UTC para datas
4. **Currency**: Sempre armazenar valores em centavos
5. **Trial vs Free Period**: São conceitos diferentes (trial do plano vs cupom)

---

**Última atualização**: 2025-12-09
**Versão**: 1.0.0
**Status**: Pronto para implementação ✅
