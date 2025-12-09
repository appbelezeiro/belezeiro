# AI Context - Agenda API

Este documento serve como manual de instruções e contexto global para IAs trabalharem neste projeto. Leia atentamente antes de fazer qualquer implementação ou modificação.

## Índice

1. [Visão Geral da Arquitetura](#visão-geral-da-arquitetura)
2. [Estrutura de Diretórios](#estrutura-de-diretórios)
3. [Padrões de Domain Entities](#padrões-de-domain-entities)
4. [Padrões de Use Cases](#padrões-de-use-cases)
5. [Padrões de Repositories](#padrões-de-repositories)
6. [Padrões de Controllers e Routes](#padrões-de-controllers-e-routes)
7. [Dependency Injection](#dependency-injection)
8. [Error Handling](#error-handling)
9. [Testes Unitários](#testes-unitários)
10. [Testes E2E](#testes-e2e)
11. [Convenções de Código](#convenções-de-código)
12. [Checklist para Novas Features](#checklist-para-novas-features)

---

## Visão Geral da Arquitetura

Este projeto segue **Clean Architecture + DDD (Domain-Driven Design)** com separação clara de camadas:

```
┌─────────────────────────────────────────┐
│         Infra (HTTP, DB, etc)           │
│  ┌───────────────────────────────────┐  │
│  │      Application (Use Cases)      │  │
│  │  ┌─────────────────────────────┐  │  │
│  │  │    Domain (Entities)        │  │  │
│  │  └─────────────────────────────┘  │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

### Camadas:

1. **Domain** (`src/domain`): Núcleo da aplicação com regras de negócio puras
   - **Entities**: Objetos de negócio com comportamento e lógica
   - **Value Objects**: Objetos imutáveis sem identidade própria (se necessário)
   - **Domain Services**: Lógica de negócio que não pertence a uma entidade específica
   - **Domain Errors**: Exceções específicas do domínio (ex: `BookingConflictError`)
   - **Service Interfaces**: Contratos para serviços externos

2. **Application** (`src/application`): Casos de uso e orquestração
   - **Use Cases**: Casos de uso da aplicação, orquestram domínio
   - **Contracts**: Interfaces para repositórios
   - **DTOs/Mappers**: Mapeadores de dados para transformar entidades em DTOs de resposta

3. **Infra** (`src/infra`): Implementações técnicas e frameworks
   - **HTTP**: Controllers (orquestram múltiplos use cases), Routes, Middleware
   - **HTTP Errors**: Erros relacionados à camada HTTP (ex: `UnauthorizedError` para token inválido)
   - **Repositories**: Implementações de persistência
   - **DI**: Dependency Injection
   - **Services**: Implementações de serviços (ID generator, hash, etc)

---

## Estrutura de Diretórios

```
apps/api/
├── __tests__/
│   ├── e2e/                    # Testes end-to-end
│   ├── helpers/                # Utilitários de teste
│   ├── e2e-setup.ts           # Setup global E2E
│   └── setup.ts               # Setup global unit tests
├── src/
│   ├── domain/
│   │   ├── entities/          # Entidades de domínio
│   │   ├── errors/            # Errors do domínio (BookingConflictError, etc)
│   │   └── services/          # Interfaces de serviços do domínio
│   ├── application/
│   │   ├── contracts/         # Interfaces de repositórios
│   │   ├── dtos/              # DTOs de resposta (por entidade)
│   │   │   └── mappers/       # Mappers para converter Entity → DTO
│   │   └── usecases/          # Casos de uso
│   └── infra/
│       ├── clients/           # Clientes externos (Prisma, Redis, etc)
│       ├── di/                # Dependency Injection
│       │   ├── factories/     # Factories de DI
│       │   └── factory-root.ts
│       ├── http/
│       │   ├── controllers/   # Controllers HTTP (orquestram use cases)
│       │   ├── routes/        # Rotas HTTP
│       │   ├── errors/        # Errors HTTP (UnauthorizedError, etc)
│       │   ├── middleware/    # Middlewares
│       │   └── server.ts      # Servidor HTTP
│       ├── repositories/      # Implementações de repositórios
│       │   └── in-memory/     # Repositórios em memória
│       │       └── data-mappers/  # Mapeadores Entity ↔ Persistence
│       └── services/          # Implementações de serviços
├── doc/                       # Documentação
├── package.json
├── tsconfig.json
├── vitest.config.ts          # Config testes unitários
└── vitest.e2e.config.ts      # Config testes E2E
```

---

## Padrões de Domain Entities

### Estrutura Base

Todas as entidades herdam de `BaseEntity`:

```typescript
// src/domain/entities/base.entity.ts

export interface BaseEntityProps {
  id: string;
  created_at: Date;
  updated_at: Date;
}

export interface BaseEntityCreationProps {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

export abstract class BaseEntity<EProps = {}> {
  protected props: Props<EProps>;

  protected abstract prefix(): string;  // OBRIGATÓRIO implementar

  constructor(props: Omit<Props<EProps>, keyof BaseEntityProps> & BaseEntityCreationProps) {
    // Auto-gera ID, created_at, updated_at se não fornecidos
  }

  get id(): string { return this.props.id; }
  get created_at(): Date { return this.props.created_at; }
  get updated_at(): Date { return this.props.updated_at; }

  touch(): void {
    this.props.updated_at = new Date();
  }
}
```

### Como Criar uma Nova Entidade

**Template:**

```typescript
// src/domain/entities/example.entity.ts

import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

// 1. Definir propriedades específicas da entidade
type ExampleEntityOwnProps = {
  field1: string;
  field2: number;
  optional_field?: string;
};

// 2. Tipos de criação e propriedades completas
type ExampleEntityCreationProps = ExampleEntityOwnProps & BaseEntityCreationProps;
type ExampleEntityProps = Required<ExampleEntityOwnProps> & BaseEntityProps;

// 3. Implementar entidade
export class ExampleEntity extends BaseEntity<ExampleEntityProps> {
  // OBRIGATÓRIO: prefixo para IDs (ex: "ex" gera IDs como "ex_01HXXX...")
  protected prefix(): string {
    return 'ex';
  }

  constructor(props: ExampleEntityCreationProps) {
    super(props);
  }

  // Getters para todas as propriedades (somente leitura)
  get field1(): string {
    return this.props.field1;
  }

  get field2(): number {
    return this.props.field2;
  }

  get optional_field(): string | undefined {
    return this.props.optional_field;
  }

  // Métodos de negócio que modificam a entidade
  update_field1(new_value: string): void {
    this.props.field1 = new_value;
    this.touch();  // SEMPRE chamar touch() ao modificar
  }

  update_field2(new_value: number): void {
    this.props.field2 = new_value;
    this.touch();
  }
}
```

### Regras para Entidades

1. **Prefixo de ID**: Cada entidade DEVE ter um prefixo único (até 5 caracteres)
   - `usr` para User
   - `srl` para ScheduleRule
   - `sex` para ScheduleException
   - `book` para Booking
   - `sched` para Schedule
   - Use prefixos descritivos e únicos

2. **Imutabilidade Externa**: Props são privadas, acesso apenas via getters

3. **Métodos de Modificação**:
   - Sempre chamam `this.touch()` para atualizar `updated_at`
   - Nomeados como `update_*`, `activate`, `deactivate`, etc.
   - **IMPORTANTE**: Lançam **Domain Errors** quando regras de negócio são violadas

4. **Props Opcionais**: Use `Partial` e `Omit` para props com valores padrão

5. **Validações de Negócio**: Lógica de validação fica na entidade e lança Domain Errors

**Exemplo com valor padrão:**

```typescript
type MyEntityCreationProps = Omit<MyEntityOwnProps, 'is_active'> &
  Partial<Pick<MyEntityOwnProps, 'is_active'>> &
  BaseEntityCreationProps;

constructor(props: MyEntityCreationProps) {
  super({
    ...props,
    is_active: props.is_active ?? true,  // valor padrão
  });
}
```

---

## Domain Errors

Domain Errors são exceções específicas do domínio, representando violações de regras de negócio. Eles vivem em `src/domain/errors/` e são diferentes dos HTTP Errors.

### Estrutura de Domain Error

```typescript
// src/domain/errors/domain-error.ts

export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### Exemplos de Domain Errors

```typescript
// src/domain/errors/booking-conflict.error.ts

import { DomainError } from './domain-error';

export class BookingConflictError extends DomainError {
  constructor(message: string = 'Booking conflict detected') {
    super(message);
  }
}
```

```typescript
// src/domain/errors/invalid-time-range.error.ts

import { DomainError } from './domain-error';

export class InvalidTimeRangeError extends DomainError {
  constructor(message: string = 'Invalid time range') {
    super(message);
  }
}
```

```typescript
// src/domain/errors/invalid-schedule-rule.error.ts

import { DomainError } from './domain-error';

export class InvalidScheduleRuleError extends DomainError {
  constructor(message: string = 'Invalid schedule rule') {
    super(message);
  }
}
```

### Uso em Entidades

Entidades lançam Domain Errors quando regras de negócio são violadas:

```typescript
// src/domain/entities/booking.entity.ts

import { BookingConflictError } from '@/domain/errors/booking-conflict.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';

export class BookingEntity extends BaseEntity<BookingEntityProps> {
  protected prefix(): string {
    return 'book';
  }

  validate_time_range(): void {
    if (this.props.start_time >= this.props.end_time) {
      throw new InvalidTimeRangeError(
        `Start time (${this.props.start_time}) must be before end time (${this.props.end_time})`
      );
    }
  }

  check_conflict_with(other: BookingEntity): void {
    if (this.overlaps_with(other)) {
      throw new BookingConflictError(
        `Booking ${this.id} conflicts with booking ${other.id}`
      );
    }
  }

  private overlaps_with(other: BookingEntity): boolean {
    return (
      this.props.start_time < other.props.end_time &&
      this.props.end_time > other.props.start_time
    );
  }
}
```

### Uso em Use Cases

Use Cases capturam Domain Errors e podem:
1. Deixar propagar (use case falha)
2. Tratar e tomar ação alternativa
3. Transformar em outro tipo de erro se necessário

```typescript
// src/application/usecases/create-booking.usecase.ts

import { BookingEntity } from '@/domain/entities/booking.entity';
import { BookingConflictError } from '@/domain/errors/booking-conflict.error';

class UseCase {
  async execute(input: UseCase.Input): UseCase.Output {
    const booking = new BookingEntity({
      user_id: input.user_id,
      start_time: input.start_time,
      end_time: input.end_time,
    });

    // Valida regras de negócio (lança error se inválido)
    booking.validate_time_range();

    // Busca bookings existentes
    const existing = await this.booking_repository.find_overlapping(
      input.user_id,
      input.start_time,
      input.end_time
    );

    // Verifica conflitos
    for (const existing_booking of existing) {
      booking.check_conflict_with(existing_booking);
    }

    return this.booking_repository.create(booking);
  }
}
```

### Tratamento no Controller

Controllers capturam Domain Errors e os transformam em HTTP Errors apropriados:

```typescript
// src/infra/http/controllers/booking.controller.ts

import { BookingConflictError } from '@/domain/errors/booking-conflict.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';
import { ConflictError, BadRequestError } from '../errors/http-errors';

export class BookingController {
  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateBookingSchema.parse(body);

      const booking = await this.container.use_cases.create_booking.execute({
        user_id: payload.user_id,
        start_time: payload.start_time,
        end_time: payload.end_time,
      });

      return c.json({ id: booking.id, /* ... */ }, 201);
    } catch (error) {
      // Transforma Domain Errors em HTTP Errors
      if (error instanceof BookingConflictError) {
        throw new ConflictError(error.message);
      }
      if (error instanceof InvalidTimeRangeError) {
        throw new BadRequestError(error.message);
      }
      // Deixa outros erros propagarem
      throw error;
    }
  }
}
```

### Regras para Domain Errors

1. **Localização**: `src/domain/errors/`
2. **Herdam de `DomainError`**: Todas as exceções de domínio
3. **Nomeação**: `*Error` (ex: `BookingConflictError`)
4. **Mensagens descritivas**: Explique o que foi violado
5. **Lançados por**: Entidades, Value Objects, Domain Services
6. **Capturados por**: Use Cases (opcional) e Controllers (sempre)
7. **Não confundir com HTTP Errors**: Domain errors são conceitos de negócio

### Domain Errors vs HTTP Errors

| Aspecto | Domain Error | HTTP Error |
|---------|--------------|------------|
| **Camada** | Domain | Infra (HTTP) |
| **Propósito** | Violação de regra de negócio | Erro na comunicação HTTP |
| **Exemplos** | `BookingConflictError`, `InvalidTimeRangeError` | `UnauthorizedError`, `NotFoundError` |
| **Lançado por** | Entities, Domain Services | Controllers, Middleware |
| **Possui status code?** | ❌ Não | ✅ Sim |
| **Onde tratar** | Use Cases ou Controllers | Global Error Handler |

---

## Padrões de Use Cases

### Estrutura Padrão

Use Cases seguem um padrão consistente com namespace para tipos:

```typescript
// src/application/usecases/example.usecase.ts

import { ExampleEntity } from '@/domain/entities/example.entity';
import { IExampleRepository } from '@/application/contracts/i-example-repository.interface';

class UseCase {
  constructor(
    private readonly example_repository: IExampleRepository,
    // Injetar APENAS repositórios e serviços necessários
  ) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // 1. Validações de negócio (se necessário)

    // 2. Criar/buscar entidades
    const entity = new ExampleEntity({
      field1: input.field1,
      field2: input.field2,
    });

    // 3. Persistir/buscar dados via repositório
    return this.example_repository.create(entity);
  }
}

// Namespace para tipos de Input/Output
declare namespace UseCase {
  export type Input = {
    field1: string;
    field2: number;
  };

  export type Output = Promise<ExampleEntity>;
}

// Export com nome semântico
export { UseCase as ExampleUseCase };
```

### Regras para Use Cases

1. **Nome**: Sempre no formato `<Verbo><Substantivo>UseCase`
   - `CreateUserUseCase`
   - `GetSlotsByDayUseCase`
   - `UpdateScheduleRuleUseCase`

2. **Responsabilidade Única**: Um use case = uma ação

3. **Dependências**:
   - Injetar via construtor
   - Usar APENAS interfaces (não implementações concretas)
   - Repositórios e serviços do domínio

4. **Input/Output**:
   - Sempre declarados no namespace
   - Input: objeto com propriedades necessárias
   - Output: sempre `Promise<T>`

5. **Método `execute`**: Único método público

### Exemplo Completo

```typescript
// src/application/usecases/create-schedule-rule.usecase.ts

import { ScheduleRuleEntity } from '@/domain/entities/schedule-rule.entity';
import { IScheduleRuleRepository } from '@/application/contracts/i-schedule-rule-repository.interface';

class UseCase {
  constructor(private readonly schedule_rule_repository: IScheduleRuleRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const rule = new ScheduleRuleEntity({
      user_id: input.user_id,
      weekday: input.weekday,
      start_time: input.start_time,
      end_time: input.end_time,
      slot_duration_minutes: input.slot_duration_minutes,
    });

    return this.schedule_rule_repository.create(rule);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    weekday: number[];
    start_time: string;
    end_time: string;
    slot_duration_minutes: number;
  };

  export type Output = Promise<ScheduleRuleEntity>;
}

export { UseCase as CreateScheduleRuleUseCase };
```

---

## DTOs e Mappers (Application Layer)

A camada de Application possui DTOs (Data Transfer Objects) e Mappers para transformar entidades em objetos de resposta customizados. Isso permite controlar exatamente quais dados são expostos para cada use case.

### Estrutura

```
application/
├── dtos/
│   ├── user.dto.ts              # DTOs de User
│   ├── booking.dto.ts           # DTOs de Booking
│   └── mappers/
│       ├── user.mapper.ts       # Mapper para User
│       └── booking.mapper.ts    # Mapper para Booking
```

### DTO (Data Transfer Object)

DTOs são objetos simples (POJOs) que representam dados de saída:

```typescript
// src/application/dtos/user.dto.ts

export interface UserDTO {
  id: string;
  name: string;
  email: string;
  created_at: Date;
}

export interface UserSummaryDTO {
  id: string;
  name: string;
}

export interface UserWithStatsDTO extends UserDTO {
  total_bookings: number;
  active_schedules: number;
}
```

### Mapper

Mappers transformam Entities em DTOs:

```typescript
// src/application/dtos/mappers/user.mapper.ts

import { UserEntity } from '@/domain/entities/user.entity';
import { UserDTO, UserSummaryDTO, UserWithStatsDTO } from '../user.dto';

export class UserMapper {
  static toDTO(entity: UserEntity): UserDTO {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      created_at: entity.created_at,
    };
  }

  static toSummary(entity: UserEntity): UserSummaryDTO {
    return {
      id: entity.id,
      name: entity.name,
    };
  }

  static toWithStats(
    entity: UserEntity,
    total_bookings: number,
    active_schedules: number
  ): UserWithStatsDTO {
    return {
      ...this.toDTO(entity),
      total_bookings,
      active_schedules,
    };
  }

  static toDTOList(entities: UserEntity[]): UserDTO[] {
    return entities.map(this.toDTO);
  }

  static toSummaryList(entities: UserEntity[]): UserSummaryDTO[] {
    return entities.map(this.toSummary);
  }
}
```

### Exemplo Completo com Booking

```typescript
// src/application/dtos/booking.dto.ts

export interface BookingDTO {
  id: string;
  user_id: string;
  start_time: Date;
  end_time: Date;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: Date;
}

export interface BookingWithUserDTO extends BookingDTO {
  user: {
    id: string;
    name: string;
  };
}

export interface BookingListItemDTO {
  id: string;
  start_time: Date;
  end_time: Date;
  status: string;
}
```

```typescript
// src/application/dtos/mappers/booking.mapper.ts

import { BookingEntity } from '@/domain/entities/booking.entity';
import { UserEntity } from '@/domain/entities/user.entity';
import { BookingDTO, BookingWithUserDTO, BookingListItemDTO } from '../booking.dto';

export class BookingMapper {
  static toDTO(entity: BookingEntity): BookingDTO {
    return {
      id: entity.id,
      user_id: entity.user_id,
      start_time: entity.start_time,
      end_time: entity.end_time,
      status: entity.status,
      created_at: entity.created_at,
    };
  }

  static toWithUser(entity: BookingEntity, user: UserEntity): BookingWithUserDTO {
    return {
      ...this.toDTO(entity),
      user: {
        id: user.id,
        name: user.name,
      },
    };
  }

  static toListItem(entity: BookingEntity): BookingListItemDTO {
    return {
      id: entity.id,
      start_time: entity.start_time,
      end_time: entity.end_time,
      status: entity.status,
    };
  }

  static toDTOList(entities: BookingEntity[]): BookingDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: BookingEntity[]): BookingListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
```

### Uso no Controller

Controllers usam os Mappers para transformar entidades em DTOs:

```typescript
// src/infra/http/controllers/booking.controller.ts

import { BookingMapper } from '@/application/dtos/mappers/booking.mapper';
import { UserMapper } from '@/application/dtos/mappers/user.mapper';

export class BookingController {
  async create(c: Context) {
    const body = await c.req.json();
    const payload = CreateBookingSchema.parse(body);

    const booking = await this.container.use_cases.create_booking.execute({
      user_id: payload.user_id,
      start_time: payload.start_time,
      end_time: payload.end_time,
    });

    // Usa mapper para converter entity → DTO
    return c.json(BookingMapper.toDTO(booking), 201);
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const booking = await this.container.use_cases.get_booking_by_id.execute({ id });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // Busca user para retornar booking com user
    const user = await this.container.use_cases.get_user_by_id.execute({
      id: booking.user_id,
    });

    // Usa mapper que inclui dados do user
    return c.json(BookingMapper.toWithUser(booking, user!));
  }

  async list(c: Context) {
    const { user_id } = c.req.query();

    const bookings = await this.container.use_cases.list_bookings.execute({
      user_id,
    });

    // Usa mapper para lista simplificada
    return c.json({
      items: BookingMapper.toListItemList(bookings),
      total: bookings.length,
    });
  }
}
```

### Regras para DTOs e Mappers

1. **Localização**: `src/application/dtos/` e `src/application/dtos/mappers/`
2. **Um DTO por entidade**: `user.dto.ts`, `booking.dto.ts`
3. **Múltiplas variações**: DTOs diferentes para contextos diferentes
   - `UserDTO`: Dados completos
   - `UserSummaryDTO`: Dados resumidos
   - `UserWithStatsDTO`: Com dados agregados
4. **Mappers são classes estáticas**: Métodos estáticos para conversão
5. **Nomenclatura**:
   - DTOs: `*DTO` (ex: `UserDTO`, `BookingListItemDTO`)
   - Mappers: `*Mapper` (ex: `UserMapper`, `BookingMapper`)
6. **Controllers usam Mappers**: NUNCA retornar entidades diretamente
7. **Use Cases retornam Entities**: Conversão para DTO acontece no Controller

### Benefícios

1. **Controle fino** sobre dados expostos
2. **Segurança**: Não expõe dados sensíveis inadvertidamente
3. **Flexibilidade**: Diferentes representações para diferentes contextos
4. **Desacoplamento**: Mudanças nas entidades não afetam API
5. **Testabilidade**: Fácil testar transformações

---

## Padrões de Repositories

### Interface do Repositório

```typescript
// src/application/contracts/i-example-repository.interface.ts

import { ExampleEntity } from '@/domain/entities/example.entity';

export interface IExampleRepository {
  create(entity: ExampleEntity): Promise<ExampleEntity>;
  find_by_id(id: string): Promise<ExampleEntity | null>;
  list_all(): Promise<ExampleEntity[]>;
  update(entity: ExampleEntity): Promise<ExampleEntity>;
  delete(id: string): Promise<boolean>;

  // Métodos específicos do domínio
  find_by_user_id(user_id: string): Promise<ExampleEntity[]>;
}
```

### Data Mapper

```typescript
// src/infra/repositories/in-memory/data-mappers/example.data-mapper.ts

import { ExampleEntity } from '@/domain/entities/example.entity';

export interface ExamplePersistence {
  id: string;
  field1: string;
  field2: number;
  created_at: Date;
  updated_at: Date;
}

export class ExampleDataMapper {
  static toDomain(raw: ExamplePersistence): ExampleEntity {
    return new ExampleEntity({
      id: raw.id,
      field1: raw.field1,
      field2: raw.field2,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: ExampleEntity): ExamplePersistence {
    return {
      id: entity.id,
      field1: entity.field1,
      field2: entity.field2,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
```

### Implementação In-Memory

```typescript
// src/infra/repositories/in-memory/in-memory-example.repository.ts

import { ExampleEntity } from '@/domain/entities/example.entity';
import { IExampleRepository } from '@/application/contracts/i-example-repository.interface';
import { ExampleDataMapper, ExamplePersistence } from './data-mappers/example.data-mapper';

export class InMemoryExampleRepository implements IExampleRepository {
  private items: ExamplePersistence[] = [];

  async create(entity: ExampleEntity): Promise<ExampleEntity> {
    const persistence = ExampleDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return ExampleDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<ExampleEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? ExampleDataMapper.toDomain(item) : null;
  }

  async list_all(): Promise<ExampleEntity[]> {
    return this.items.map(ExampleDataMapper.toDomain);
  }

  async update(entity: ExampleEntity): Promise<ExampleEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Example with id ${entity.id} not found`);
    }

    const persistence = ExampleDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return ExampleDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async find_by_user_id(user_id: string): Promise<ExampleEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id)
      .map(ExampleDataMapper.toDomain);
  }
}
```

### Regras para Repositórios

1. **Interface no `application/contracts`**: Define o contrato
2. **Data Mapper**: Converte entre entidade e persistência
3. **Implementação In-Memory**: Para testes e desenvolvimento
4. **Retornos**:
   - `find_*`: Retorna entidade ou `null`
   - `list_*`: Retorna array (vazio se não houver)
   - `create/update`: Retorna a entidade
   - `delete`: Retorna boolean

---

## Padrões de Controllers e Routes

Controllers são responsáveis por orquestrar o fluxo HTTP. Eles **podem chamar múltiplos use cases** quando necessário para completar uma operação complexa.

### Responsabilidades do Controller

1. **Validação de entrada** (Zod schemas)
2. **Orquestração de use cases** (pode chamar 1 ou N use cases)
3. **Tratamento de Domain Errors** → HTTP Errors
4. **Transformação Entity → DTO** (usando Mappers)
5. **Retorno da resposta HTTP**

### Schema de Validação (Zod)

```typescript
// src/infra/http/controllers/example.controller.ts

import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';

// Schemas de validação
const CreateExampleSchema = z.object({
  field1: z.string().min(1),
  field2: z.number().positive(),
  optional_field: z.string().optional(),
});

const UpdateExampleSchema = z.object({
  field1: z.string().min(1).optional(),
  field2: z.number().positive().optional(),
});
```

### Controller

```typescript
export class ExampleController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    // 1. Parse e valida body
    const body = await c.req.json();
    const payload = CreateExampleSchema.parse(body);

    // 2. Executa use case
    const result = await this.container.use_cases.create_example.execute({
      field1: payload.field1,
      field2: payload.field2,
    });

    // 3. Retorna resposta
    return c.json(
      {
        id: result.id,
        field1: result.field1,
        field2: result.field2,
      },
      201,  // Status code apropriado
    );
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const result = await this.container.use_cases.get_example_by_id.execute({ id });

    if (!result) {
      throw new NotFoundError('Example not found');
    }

    return c.json({
      id: result.id,
      field1: result.field1,
      field2: result.field2,
    });
  }

  async list(c: Context) {
    const results = await this.container.use_cases.list_examples.execute();

    return c.json({
      items: results.map(r => ({
        id: r.id,
        field1: r.field1,
        field2: r.field2,
      })),
      total: results.length,
    });
  }

  async update(c: Context) {
    const { id } = c.req.param();
    const body = await c.req.json();
    const payload = UpdateExampleSchema.parse(body);

    const result = await this.container.use_cases.update_example.execute({
      id,
      ...payload,
    });

    return c.json({
      id: result.id,
      field1: result.field1,
      field2: result.field2,
    });
  }

  async delete(c: Context) {
    const { id } = c.req.param();

    await this.container.use_cases.delete_example.execute({ id });

    return c.json({ success: true }, 204);
  }
}
```

### Controller Orquestrando Múltiplos Use Cases

Controllers **podem e devem** orquestrar múltiplos use cases quando o fluxo de negócio requer:

```typescript
// src/infra/http/controllers/booking.controller.ts

import { BookingMapper } from '@/application/dtos/mappers/booking.mapper';
import { UserMapper } from '@/application/dtos/mappers/user.mapper';
import { BookingConflictError } from '@/domain/errors/booking-conflict.error';
import { ConflictError, NotFoundError } from '../errors/http-errors';

export class BookingController {
  constructor(private readonly container: Container) {}

  /**
   * Exemplo: Orquestra múltiplos use cases
   * 1. Valida se user existe
   * 2. Cria o booking
   * 3. Envia notificação
   * 4. Retorna booking com dados do user
   */
  async create(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateBookingSchema.parse(body);

      // 1. Valida se user existe
      const user = await this.container.use_cases.get_user_by_id.execute({
        id: payload.user_id,
      });

      if (!user) {
        throw new NotFoundError('User not found');
      }

      // 2. Cria o booking (pode lançar BookingConflictError)
      const booking = await this.container.use_cases.create_booking.execute({
        user_id: payload.user_id,
        start_time: payload.start_time,
        end_time: payload.end_time,
      });

      // 3. Envia notificação (use case separado, fire-and-forget)
      this.container.use_cases.send_booking_notification.execute({
        booking_id: booking.id,
        user_email: user.email,
      }).catch(err => {
        // Log error mas não falha a request
        console.error('Failed to send notification:', err);
      });

      // 4. Retorna booking com dados do user
      return c.json(BookingMapper.toWithUser(booking, user), 201);

    } catch (error) {
      // Transforma Domain Errors em HTTP Errors
      if (error instanceof BookingConflictError) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  }

  /**
   * Exemplo: Busca booking e dados relacionados
   * 1. Busca booking
   * 2. Busca user
   * 3. Busca estatísticas do user
   * 4. Retorna tudo combinado
   */
  async get_with_details(c: Context) {
    const { id } = c.req.param();

    // 1. Busca booking
    const booking = await this.container.use_cases.get_booking_by_id.execute({ id });

    if (!booking) {
      throw new NotFoundError('Booking not found');
    }

    // 2. Busca user em paralelo com estatísticas
    const [user, stats] = await Promise.all([
      this.container.use_cases.get_user_by_id.execute({ id: booking.user_id }),
      this.container.use_cases.get_user_booking_stats.execute({ user_id: booking.user_id }),
    ]);

    // 3. Combina tudo e retorna
    return c.json({
      booking: BookingMapper.toDTO(booking),
      user: UserMapper.toWithStats(user!, stats.total_bookings, stats.active_schedules),
    });
  }

  /**
   * Exemplo: Operação em lote
   * Cancela múltiplos bookings de uma vez
   */
  async cancel_multiple(c: Context) {
    const body = await c.req.json();
    const payload = CancelMultipleBookingsSchema.parse(body);

    const results = await Promise.allSettled(
      payload.booking_ids.map(id =>
        this.container.use_cases.cancel_booking.execute({ id })
      )
    );

    const successes = results.filter(r => r.status === 'fulfilled').length;
    const failures = results.filter(r => r.status === 'rejected').length;

    return c.json({
      total: payload.booking_ids.length,
      successes,
      failures,
    });
  }
}
```

### Regras para Orquestração de Use Cases

1. **Um use case = uma responsabilidade**: Use cases devem ser focados
2. **Controller orquestra**: Combina múltiplos use cases quando necessário
3. **Transações**: Se precisa de transação, considere criar um use case específico
4. **Paralelização**: Use `Promise.all` quando use cases são independentes
5. **Fire-and-forget**: Para operações não críticas (notificações, logs), use `.catch()`
6. **Error handling**: Capture Domain Errors e transforme em HTTP Errors
7. **DTOs**: Use Mappers para combinar dados de múltiplas entidades

### Routes

```typescript
// src/infra/http/routes/example.routes.ts

import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { ExampleController } from '../controllers/example.controller';

export function createExampleRoutes(container: Container) {
  const router = new Hono();
  const controller = new ExampleController(container);

  router.post('/', (context) => controller.create(context));
  router.get('/', (context) => controller.list(context));
  router.get('/:id', (context) => controller.get_by_id(context));
  router.put('/:id', (context) => controller.update(context));
  router.delete('/:id', (context) => controller.delete(context));

  return router;
}
```

### Registrar no Index de Routes

```typescript
// src/infra/http/routes/index.ts

import { createExampleRoutes } from './example.routes';

export function createRoutes(container: Container) {
  const app = new Hono();

  app.route('/users', createUserRoutes(container));
  app.route('/examples', createExampleRoutes(container));  // Adicionar aqui

  return app;
}
```

### Regras para Controllers e Routes

1. **Controller recebe Container**: Não recebe use cases diretamente
2. **Validação com Zod**: Sempre validar input antes de chamar use case
3. **Status Codes**:
   - `200`: Sucesso (GET, PUT)
   - `201`: Criado (POST)
   - `204`: Sucesso sem conteúdo (DELETE)
   - `404`: Não encontrado
   - `422`: Erro de validação
   - `500`: Erro interno

4. **Responses**: Retornar apenas dados necessários (não entidade completa)
5. **Routes**: Uma função `create*Routes` por recurso

---

## Dependency Injection

### Estrutura de Factories

```
infra/di/
├── factories/
│   ├── clients.factory.ts       # Clientes externos
│   ├── repositories.factory.ts  # Repositórios
│   └── use-cases.factory.ts     # Use cases
└── factory-root.ts              # Container root
```

### Clients Factory

```typescript
// src/infra/di/factories/clients.factory.ts

import { PrismaClient } from '@prisma/client';
import { Redis } from 'ioredis';

export function createClients() {
  const prisma = new PrismaClient();
  const redis = new Redis(process.env.REDIS_URL);

  return {
    prisma,
    redis,
  };
}

export type Clients = ReturnType<typeof createClients>;
```

### Repositories Factory

```typescript
// src/infra/di/factories/repositories.factory.ts

import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user.repository';
import { InMemoryExampleRepository } from '@/infra/repositories/in-memory/in-memory-example.repository';
import type { Clients } from './clients.factory';

export function createRepositories(_clients: Clients) {
  const user_repository = new InMemoryUserRepository();
  const example_repository = new InMemoryExampleRepository();

  return {
    user_repository,
    example_repository,
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
```

### Use Cases Factory

```typescript
// src/infra/di/factories/use-cases.factory.ts

import { CreateExampleUseCase } from '@/application/usecases/create-example.usecase';
import { GetExampleByIdUseCase } from '@/application/usecases/get-example-by-id.usecase';
import type { Repositories } from './repositories.factory';

export function createUseCases(repositories: Repositories) {
  return {
    // Example use cases
    create_example: new CreateExampleUseCase(repositories.example_repository),
    get_example_by_id: new GetExampleByIdUseCase(repositories.example_repository),
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
```

### Factory Root

```typescript
// src/infra/di/factory-root.ts

import { createClients } from './factories/clients.factory';
import { createRepositories } from './factories/repositories.factory';
import { createUseCases } from './factories/use-cases.factory';

export function container() {
  const clients = createClients();
  const repositories = createRepositories(clients);
  const use_cases = createUseCases(repositories);

  return {
    clients,
    repositories,
    use_cases,
  };
}

export type Container = ReturnType<typeof container>;
```

### Regras de DI

1. **Fluxo de dependências**: Clients → Repositories → UseCases
2. **Type Safety**: Sempre exportar tipo do ReturnType
3. **Ordem de criação**: Factories são chamadas em ordem
4. **Container único**: Criado uma vez no server.ts

---

## Error Handling

### Errors Customizados

```typescript
// src/infra/http/errors/http-errors.ts

export class HttpError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: unknown,
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR', details);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ConflictError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(message, 409, 'CONFLICT', details);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string, details?: unknown) {
    super(message, 400, 'BAD_REQUEST', details);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}
```

### Global Error Handler

```typescript
// src/infra/http/middleware/global-error.middleware.ts

import type { Context, ErrorHandler } from 'hono';
import { ZodError } from 'zod';
import { HttpError } from '../errors/http-errors';

export const globalErrorHandler: ErrorHandler = (err: unknown, c: Context) => {
  const timestamp = new Date().toISOString();
  const path = c.req.path;

  let response: Record<string, unknown> = {
    timestamp,
    path,
  };

  // Zod validation errors
  if (err instanceof ZodError) {
    response.error = 'VALIDATION_ERROR';
    response.details = err.issues.map(e => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return c.json(response, 422);
  }

  // Custom HTTP errors
  if (err instanceof HttpError) {
    response.error = err.code || err.name;
    response.message = err.message;
    if (err.details) {
      response.details = err.details;
    }
    return c.json(response, err.statusCode);
  }

  // Unknown errors
  response.error = 'INTERNAL_SERVER_ERROR';
  response.message = 'An unexpected error occurred';

  // Log error (em produção, enviar para serviço de logging)
  console.error('Unhandled error:', err);

  return c.json(response, 500);
};
```

### Uso em Controllers

```typescript
// Throw errors apropriados
if (!user) {
  throw new NotFoundError('User not found');
}

if (existingEmail) {
  throw new ConflictError('Email already exists');
}

if (!isValid) {
  throw new BadRequestError('Invalid data', { reasons: ['field1 is required'] });
}
```

### Resposta de Erro Padrão

```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users/123",
  "error": "NOT_FOUND",
  "message": "User not found"
}
```

---

## Testes Unitários

### Configuração

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Setup Global

```typescript
// __tests__/setup.ts
import { beforeAll } from 'vitest';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

beforeAll(() => {
  BaseEntity.configure({
    id_generator: new ULIDXIDGeneratorService(),
  });
});
```

### Template de Teste de Use Case

```typescript
// src/application/usecases/example.usecase.spec.ts

import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { ExampleUseCase } from './example.usecase';
import { InMemoryExampleRepository } from '@/infra/repositories/in-memory/in-memory-example.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('ExampleUseCase', () => {
  let sut: ExampleUseCase;
  let example_repository: InMemoryExampleRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    example_repository = new InMemoryExampleRepository();
    sut = new ExampleUseCase(example_repository);
  });

  it('should create a new example', async () => {
    const input = {
      field1: 'value1',
      field2: 42,
    };

    const result = await sut.execute(input);

    expect(result.field1).toBe('value1');
    expect(result.field2).toBe(42);
    expect(result.id).toContain('ex_');
  });

  it('should throw error if validation fails', async () => {
    // Teste de erro
    await expect(
      sut.execute({ field1: '', field2: -1 })
    ).rejects.toThrow();
  });
});
```

### Regras para Testes Unitários

1. **Naming**: `<FileName>.spec.ts`
2. **SUT**: System Under Test (o que está sendo testado)
3. **beforeAll**: Configurar BaseEntity UMA vez
4. **beforeEach**: Reset de repositórios e SUT
5. **Testes**:
   - Happy path primeiro
   - Edge cases depois
   - Erros por último

### Comandos

```bash
# Rodar todos os testes unitários
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage
```

---

## Testes E2E

### Configuração

```typescript
// vitest.e2e.config.ts
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['__tests__/e2e/**/*.e2e.spec.ts'],
    setupFiles: ['__tests__/e2e-setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### Test Server Helper

```typescript
// __tests__/helpers/test-server.ts

import request from 'supertest';
import { createServer } from '@/infra/http/server';
import type { IncomingMessage, ServerResponse } from 'node:http';

export function createTestServer() {
  const app = createServer();

  const handleRequest = async (req: IncomingMessage, res: ServerResponse) => {
    const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

    let body: string | undefined;
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      const chunks: Buffer[] = [];
      for await (const chunk of req) {
        chunks.push(chunk);
      }
      body = Buffer.concat(chunks).toString();
    }

    const webRequest = new Request(url.toString(), {
      method: req.method,
      headers: req.headers as any,
      body: body && body.length > 0 ? body : undefined,
    });

    try {
      const webResponse = await app.fetch(webRequest);

      res.statusCode = webResponse.status;
      webResponse.headers.forEach((value, key) => {
        res.setHeader(key, value);
      });

      const responseBody = await webResponse.text();
      res.end(responseBody);
    } catch (err) {
      res.statusCode = 500;
      res.end(err instanceof Error ? err.message : 'Internal server error');
    }
  };

  return request(handleRequest);
}
```

### Template de Teste E2E

```typescript
// __tests__/e2e/example.e2e.spec.ts

import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Example E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/examples', () => {
    it('should create a new example successfully', async () => {
      const response = await server
        .post('/api/examples')
        .send({
          field1: 'value1',
          field2: 42,
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('field1', 'value1');
      expect(response.body).toHaveProperty('field2', 42);
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return 422 if validation fails', async () => {
      const response = await server
        .post('/api/examples')
        .send({
          field1: '',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('details');
      expect(response.body).toHaveProperty('path', '/api/examples');
    });
  });

  describe('GET /api/examples/:id', () => {
    it('should return example by id', async () => {
      // 1. Create
      const createResponse = await server
        .post('/api/examples')
        .send({ field1: 'value1', field2: 42 });

      const { id } = createResponse.body;

      // 2. Get
      const response = await server.get(`/api/examples/${id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', id);
      expect(response.body).toHaveProperty('field1', 'value1');
    });

    it('should return 404 if example not found', async () => {
      const response = await server.get('/api/examples/ex_INVALID');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'NOT_FOUND');
    });
  });
});
```

### Regras para Testes E2E

1. **Naming**: `<resource>.e2e.spec.ts`
2. **beforeEach**: Criar novo server (estado limpo)
3. **Testar fluxo completo**: HTTP request → response
4. **Validar**:
   - Status code
   - Body structure
   - Headers
   - Error responses

### Comandos

```bash
# Rodar testes E2E
pnpm test:e2e

# Watch mode
pnpm test:e2e:watch
```

---

## Convenções de Código

### Nomenclatura

1. **Arquivos**: `kebab-case.ts`
   - `user.entity.ts`
   - `create-user.usecase.ts`
   - `in-memory-user.repository.ts`

2. **Classes**: `PascalCase`
   - `UserEntity`
   - `CreateUserUseCase`
   - `InMemoryUserRepository`

3. **Variáveis/Funções**: `snake_case`
   - `user_repository`
   - `created_at`
   - `find_by_id`

4. **Constantes**: `UPPER_SNAKE_CASE`
   - `MAX_RETRIES`
   - `DEFAULT_TIMEOUT`

### Imports

```typescript
// 1. External libs
import { Context } from 'hono';
import { z } from 'zod';

// 2. Domain
import { UserEntity } from '@/domain/entities/user.entity';

// 3. Application
import { IUserRepository } from '@/application/contracts/i-user-repository.interface';

// 4. Infra
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user.repository';

// 5. Types
import type { Container } from '@/infra/di/factory-root';
```

### TypeScript

1. **Interfaces para contratos**: `interface IXxx`
2. **Types para DTOs**: `type XxxProps`
3. **Avoid `any`**: Use `unknown` quando tipo é desconhecido
4. **Strict mode**: Sempre habilitado

### Comentários

Evite comentários óbvios. Comente apenas:
- Regras de negócio complexas
- Workarounds temporários
- Decisões arquiteturais importantes

---

## Checklist para Novas Features

Ao implementar uma nova feature, siga este checklist:

### 1. Domain Layer

- [ ] Criar entidade em `src/domain/entities/`
  - [ ] Herdar de `BaseEntity`
  - [ ] Definir `prefix()` único
  - [ ] Criar tipos `*Props` e `*CreationProps`
  - [ ] Implementar getters
  - [ ] Implementar métodos de modificação com `touch()`

- [ ] Criar interface de serviço se necessário em `src/domain/services/`

### 2. Application Layer

- [ ] Criar interface de repositório em `src/application/contracts/`
  - [ ] Métodos CRUD básicos
  - [ ] Métodos específicos do domínio

- [ ] Criar use cases em `src/application/usecases/`
  - [ ] Namespace para Input/Output
  - [ ] Injeção de dependências no construtor
  - [ ] Método `execute()`
  - [ ] Export com nome semântico

- [ ] Criar testes unitários (`*.spec.ts`)
  - [ ] Setup com `beforeAll` e `beforeEach`
  - [ ] Testes de happy path
  - [ ] Testes de edge cases
  - [ ] Testes de erros

### 3. Infrastructure Layer

- [ ] Criar data mapper em `src/infra/repositories/in-memory/data-mappers/`
  - [ ] Interface `*Persistence`
  - [ ] Métodos `toDomain()` e `toPersistence()`

- [ ] Criar repositório in-memory em `src/infra/repositories/in-memory/`
  - [ ] Implementar interface do repositório
  - [ ] Usar data mapper

- [ ] Criar controller em `src/infra/http/controllers/`
  - [ ] Schemas de validação Zod
  - [ ] Métodos para cada rota
  - [ ] Tratamento de erros

- [ ] Criar routes em `src/infra/http/routes/`
  - [ ] Função `create*Routes()`
  - [ ] Mapear rotas para controller

- [ ] Registrar no DI
  - [ ] Adicionar repositório em `repositories.factory.ts`
  - [ ] Adicionar use cases em `use-cases.factory.ts`
  - [ ] Adicionar routes em `routes/index.ts`

### 4. Testes E2E

- [ ] Criar arquivo de teste em `__tests__/e2e/`
  - [ ] Testes para cada rota
  - [ ] Validar status codes
  - [ ] Validar responses
  - [ ] Validar error handling

### 5. Validação Final

- [ ] Rodar testes unitários: `pnpm test`
- [ ] Rodar testes E2E: `pnpm test:e2e`
- [ ] Verificar tipos: `pnpm typecheck` (se configurado)
- [ ] Verificar se build funciona: `pnpm build` (se configurado)

---

## Dicas Importantes

### ❌ NÃO FAÇA

- Não pule camadas (controller chamando diretamente repository)
- Não coloque lógica de negócio no controller
- Não use implementações concretas no use case (sempre interfaces)
- Não esqueça de chamar `touch()` ao modificar entidade
- Não use `any` type
- Não commite código sem testes

### ✅ FAÇA

- Sempre valide input com Zod no controller
- Use data mappers para converter entre layers
- Mantenha use cases focados (Single Responsibility)
- Sempre teste happy path e edge cases
- Use errors customizados para HTTP
- Siga as convenções de nomenclatura

---

## Exemplo Completo: Criar Feature "Task"

Veja `examples/FEATURE_TASK_EXAMPLE.md` para um exemplo completo passo-a-passo de como criar uma nova feature do zero.

---

**Última atualização**: 2024-01-15
**Versão**: 1.0.0
