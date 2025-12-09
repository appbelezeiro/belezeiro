# Quick Reference Guide

Referência rápida para consulta durante desenvolvimento.

## Arquitetura

**Clean Architecture + DDD (Domain-Driven Design)**

- **Domain**: Entities, Domain Errors, Domain Services
- **Application**: Use Cases, DTOs, Mappers, Repository Interfaces
- **Infra**: Controllers, Routes, HTTP Errors, Repositories, Services

## Convenções de Nomenclatura

### Arquivos
```
kebab-case.ts
user.entity.ts
create-user.usecase.ts
in-memory-user.repository.ts
user.controller.ts
```

### Classes
```typescript
PascalCase
UserEntity
CreateUserUseCase
InMemoryUserRepository
UserController
```

### Variáveis/Funções
```typescript
snake_case
user_repository
created_at
find_by_id
```

### Constantes
```typescript
UPPER_SNAKE_CASE
MAX_RETRIES
DEFAULT_TIMEOUT
```

---

## Templates Rápidos

### Entity Template

```typescript
import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

type XEntityOwnProps = {
  field1: string;
  field2: number;
};

type XEntityCreationProps = XEntityOwnProps & BaseEntityCreationProps;
type XEntityProps = Required<XEntityOwnProps> & BaseEntityProps;

export class XEntity extends BaseEntity<XEntityProps> {
  protected prefix(): string {
    return 'xxx';  // 3 letras
  }

  constructor(props: XEntityCreationProps) {
    super(props);
  }

  get field1(): string {
    return this.props.field1;
  }

  update_field1(value: string): void {
    this.props.field1 = value;
    this.touch();  // SEMPRE
  }
}
```

### Domain Error Template

```typescript
// src/domain/errors/x.error.ts

import { DomainError } from './domain-error';

export class XError extends DomainError {
  constructor(message: string = 'Default error message') {
    super(message);
  }
}

// Uso na entidade:
// throw new XError('Specific error message');
```

### DTO Template

```typescript
// src/application/dtos/x.dto.ts

export interface XDTO {
  id: string;
  field1: string;
  field2: number;
  created_at: Date;
}

export interface XSummaryDTO {
  id: string;
  field1: string;
}

export interface XWithDetailsDTO extends XDTO {
  related_count: number;
}
```

### Mapper Template

```typescript
// src/application/dtos/mappers/x.mapper.ts

import { XEntity } from '@/domain/entities/x.entity';
import { XDTO, XSummaryDTO, XWithDetailsDTO } from '../x.dto';

export class XMapper {
  static toDTO(entity: XEntity): XDTO {
    return {
      id: entity.id,
      field1: entity.field1,
      field2: entity.field2,
      created_at: entity.created_at,
    };
  }

  static toSummary(entity: XEntity): XSummaryDTO {
    return {
      id: entity.id,
      field1: entity.field1,
    };
  }

  static toWithDetails(entity: XEntity, related_count: number): XWithDetailsDTO {
    return {
      ...this.toDTO(entity),
      related_count,
    };
  }

  static toDTOList(entities: XEntity[]): XDTO[] {
    return entities.map(this.toDTO);
  }
}
```

### Repository Interface Template

```typescript
import { XEntity } from '@/domain/entities/x.entity';

export interface IXRepository {
  create(entity: XEntity): Promise<XEntity>;
  find_by_id(id: string): Promise<XEntity | null>;
  list_all(): Promise<XEntity[]>;
  update(entity: XEntity): Promise<XEntity>;
  delete(id: string): Promise<boolean>;
}
```

### Use Case Template

```typescript
import { XEntity } from '@/domain/entities/x.entity';
import { IXRepository } from '@/application/contracts/i-x-repository.interface';

class UseCase {
  constructor(private readonly x_repository: IXRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    // implementação
  }
}

declare namespace UseCase {
  export type Input = {
    field1: string;
  };

  export type Output = Promise<XEntity>;
}

export { UseCase as XUseCase };
```

### Data Mapper Template

```typescript
import { XEntity } from '@/domain/entities/x.entity';

export interface XPersistence {
  id: string;
  field1: string;
  created_at: Date;
  updated_at: Date;
}

export class XDataMapper {
  static toDomain(raw: XPersistence): XEntity {
    return new XEntity({
      id: raw.id,
      field1: raw.field1,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: XEntity): XPersistence {
    return {
      id: entity.id,
      field1: entity.field1,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
```

### Repository Template

```typescript
import { XEntity } from '@/domain/entities/x.entity';
import { IXRepository } from '@/application/contracts/i-x-repository.interface';
import { XDataMapper, XPersistence } from './data-mappers/x.data-mapper';

export class InMemoryXRepository implements IXRepository {
  private items: XPersistence[] = [];

  async create(entity: XEntity): Promise<XEntity> {
    const persistence = XDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return XDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<XEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? XDataMapper.toDomain(item) : null;
  }

  async list_all(): Promise<XEntity[]> {
    return this.items.map(XDataMapper.toDomain);
  }

  async update(entity: XEntity): Promise<XEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`X with id ${entity.id} not found`);
    }
    const persistence = XDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return XDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;
    this.items.splice(index, 1);
    return true;
  }
}
```

### Controller Template (Simples)

```typescript
import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { XMapper } from '@/application/dtos/mappers/x.mapper';
import { NotFoundError } from '../errors/http-errors';

const CreateXSchema = z.object({
  field1: z.string().min(1),
});

export class XController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    const body = await c.req.json();
    const payload = CreateXSchema.parse(body);

    const result = await this.container.use_cases.create_x.execute({
      field1: payload.field1,
    });

    // Usa Mapper para converter Entity → DTO
    return c.json(XMapper.toDTO(result), 201);
  }

  async get_by_id(c: Context) {
    const { id } = c.req.param();

    const result = await this.container.use_cases.get_x_by_id.execute({ id });

    if (!result) {
      throw new NotFoundError('X not found');
    }

    return c.json(XMapper.toDTO(result));
  }
}
```

### Controller Template (Orquestrando Múltiplos Use Cases)

```typescript
import { Context } from 'hono';
import { XMapper } from '@/application/dtos/mappers/x.mapper';
import { YMapper } from '@/application/dtos/mappers/y.mapper';
import { XDomainError } from '@/domain/errors/x-domain.error';
import { ConflictError, NotFoundError } from '../errors/http-errors';

export class XController {
  constructor(private readonly container: Container) {}

  /**
   * Orquestra múltiplos use cases
   */
  async create_with_related(c: Context) {
    try {
      const body = await c.req.json();
      const payload = CreateXSchema.parse(body);

      // 1. Valida dependência
      const related = await this.container.use_cases.get_y_by_id.execute({
        id: payload.related_id,
      });

      if (!related) {
        throw new NotFoundError('Related not found');
      }

      // 2. Cria X (pode lançar Domain Error)
      const x = await this.container.use_cases.create_x.execute({
        field1: payload.field1,
        related_id: payload.related_id,
      });

      // 3. Atualiza contadores em paralelo (opcional)
      await Promise.all([
        this.container.use_cases.increment_y_counter.execute({ id: related.id }),
        this.container.use_cases.log_creation.execute({ entity_id: x.id }),
      ]);

      // 4. Retorna com dados relacionados
      return c.json({
        x: XMapper.toDTO(x),
        related: YMapper.toSummary(related),
      }, 201);

    } catch (error) {
      // Transforma Domain Errors → HTTP Errors
      if (error instanceof XDomainError) {
        throw new ConflictError(error.message);
      }
      throw error;
    }
  }
}
```

### Routes Template

```typescript
import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { XController } from '../controllers/x.controller';

export function createXRoutes(container: Container) {
  const router = new Hono();
  const controller = new XController(container);

  router.post('/', (context) => controller.create(context));
  router.get('/:id', (context) => controller.get_by_id(context));

  return router;
}
```

### Unit Test Template

```typescript
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { XUseCase } from './x.usecase';
import { InMemoryXRepository } from '@/infra/repositories/in-memory/in-memory-x.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('XUseCase', () => {
  let sut: XUseCase;
  let x_repository: InMemoryXRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    x_repository = new InMemoryXRepository();
    sut = new XUseCase(x_repository);
  });

  it('should do something', async () => {
    const input = { field1: 'value1' };

    const result = await sut.execute(input);

    expect(result.field1).toBe('value1');
    expect(result.id).toContain('xxx_');
  });
});
```

### E2E Test Template

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('X E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/x', () => {
    it('should create successfully', async () => {
      const response = await server
        .post('/api/x')
        .send({ field1: 'value1' })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('field1', 'value1');
    });

    it('should return 422 on validation error', async () => {
      const response = await server
        .post('/api/x')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
    });
  });
});
```

---

## HTTP Status Codes

```typescript
200  // OK - Sucesso (GET, PUT)
201  // Created - Criado (POST)
204  // No Content - Sucesso sem conteúdo (DELETE)
400  // Bad Request - Request inválido
401  // Unauthorized - Não autenticado
403  // Forbidden - Não autorizado
404  // Not Found - Não encontrado
409  // Conflict - Conflito (ex: email duplicado)
422  // Unprocessable Entity - Erro de validação (Zod)
500  // Internal Server Error - Erro interno
```

---

## Zod Validations

```typescript
import { z } from 'zod';

const Schema = z.object({
  // String
  name: z.string(),
  name: z.string().min(1),
  name: z.string().min(3).max(100),
  email: z.email(),
  url: z.url(),

  // Number
  age: z.number(),
  age: z.number().positive(),
  age: z.number().int(),
  age: z.number().min(18).max(100),

  // Boolean
  active: z.boolean(),

  // Optional
  field: z.string().optional(),

  // Array
  tags: z.array(z.string()),
  tags: z.string().array(),

  // Enum
  status: z.enum(['pending', 'completed']),

  // Date
  date: z.date(),
  date: z.coerce.date(),  // converte string para Date

  // Object
  address: z.object({
    street: z.string(),
    number: z.number(),
  }),

  // Transform
  age: z.string().transform((val) => parseInt(val)),

  // Refine (validação customizada)
  password: z.string().refine(
    (val) => val.length >= 8,
    { message: 'Password must be at least 8 characters' }
  ),
});
```

---

## Errors

### Domain Errors (src/domain/errors/)

Violações de regras de negócio:

```typescript
import { DomainError } from '@/domain/errors/domain-error';
import { BookingConflictError } from '@/domain/errors/booking-conflict.error';
import { InvalidTimeRangeError } from '@/domain/errors/invalid-time-range.error';

// Uso em Entities
throw new BookingConflictError('Booking conflicts with existing slot');
throw new InvalidTimeRangeError('Start time must be before end time');

// Capturar no Controller e transformar em HTTP Error
```

### HTTP Errors (src/infra/http/errors/)

Erros de comunicação HTTP:

```typescript
import {
  HttpError,
  ValidationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
} from '@/infra/http/errors/http-errors';

// Uso em Controllers
throw new NotFoundError('User not found');
throw new ConflictError('Email already exists');
throw new BadRequestError('Invalid data', { reasons: [...] });
throw new UnauthorizedError('Invalid token');
throw new ForbiddenError('Insufficient permissions');
```

### Domain Error → HTTP Error

```typescript
// Controller
try {
  await this.container.use_cases.create_booking.execute(input);
} catch (error) {
  if (error instanceof BookingConflictError) {
    throw new ConflictError(error.message);  // 409
  }
  if (error instanceof InvalidTimeRangeError) {
    throw new BadRequestError(error.message);  // 400
  }
  throw error;
}
```

---

## Import Paths

```typescript
// Domain
import { XEntity } from '@/domain/entities/x.entity';
import { XDomainError } from '@/domain/errors/x-domain.error';
import { IIDGeneratorService } from '@/domain/services/i-id-generator.service';

// Application
import { IXRepository } from '@/application/contracts/i-x-repository.interface';
import { XUseCase } from '@/application/usecases/x.usecase';
import { XDTO } from '@/application/dtos/x.dto';
import { XMapper } from '@/application/dtos/mappers/x.mapper';

// Infra
import { InMemoryXRepository } from '@/infra/repositories/in-memory/in-memory-x.repository';
import { XController } from '@/infra/http/controllers/x.controller';
import { createXRoutes } from '@/infra/http/routes/x.routes';
import { NotFoundError, ConflictError } from '@/infra/http/errors/http-errors';
import { Container } from '@/infra/di/factory-root';

// External
import { Context } from 'hono';
import { z } from 'zod';
```

---

## Comandos Úteis

```bash
# Testes
pnpm test                 # Testes unitários
pnpm test:watch          # Testes unitários (watch)
pnpm test:e2e            # Testes E2E
pnpm test:e2e:watch      # Testes E2E (watch)

# Build
pnpm build               # Build do projeto
pnpm typecheck           # Verificar tipos (se configurado)

# Dev
pnpm dev                 # Modo desenvolvimento (se configurado)
```

---

## Prefixos de ID

```typescript
// Até 5 caracteres
usr    // User
srl    // ScheduleRule
sex    // ScheduleException
tsk    // Task
book   // Booking
sched  // Schedule

// Formato: prefix_ULID
// Exemplo: usr_01HXXX...
```

---

## Ordem de Imports

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

---

## DI Registration Checklist

Ao criar nova feature:

1. **Repository Factory** (`repositories.factory.ts`)
```typescript
const x_repository = new InMemoryXRepository();

return {
  // ...outros
  x_repository,
};
```

2. **Use Cases Factory** (`use-cases.factory.ts`)
```typescript
x_use_case: new XUseCase(repositories.x_repository),
```

3. **Routes Index** (`routes/index.ts`)
```typescript
app.route('/x', createXRoutes(container));
```

---

## Response Patterns

### Success (200/201)
```json
{
  "id": "usr_01HXX...",
  "field1": "value",
  "field2": 42
}
```

### List (200)
```json
{
  "items": [
    { "id": "usr_01HXX...", "name": "John" }
  ],
  "total": 1
}
```

### Error (4xx/5xx)
```json
{
  "timestamp": "2024-01-15T10:30:00.000Z",
  "path": "/api/users",
  "error": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email"
    }
  ]
}
```

---

## Entity Patterns

### Com valor padrão
```typescript
type Props = Omit<OwnProps, 'is_active'> &
  Partial<Pick<OwnProps, 'is_active'>> &
  BaseEntityCreationProps;

constructor(props: Props) {
  super({
    ...props,
    is_active: props.is_active ?? true,
  });
}
```

### Com campos opcionais
```typescript
type Props = Required<Pick<OwnProps, 'field1' | 'field2'>> &
  Partial<Pick<OwnProps, 'optional1' | 'optional2'>> &
  BaseEntityProps;
```

---

## Regras Importantes

### ✅ SEMPRE

1. **Chamar `touch()`** ao modificar entidade
2. **Usar interfaces** no use case (não implementações concretas)
3. **Validar com Zod** no controller
4. **Usar Mappers** para converter Entity → DTO (não retornar entidades)
5. **Lançar Domain Errors** nas entidades quando regras são violadas
6. **Capturar Domain Errors** no controller e transformar em HTTP Errors
7. **Escrever testes** (unitários + E2E)
8. **Usar data mappers** para conversão Entity ↔ Persistence
9. **Controllers podem orquestrar múltiplos use cases** quando necessário
10. **Use Cases retornam Entities**, controllers usam Mappers para DTOs

### ❌ NUNCA

1. **Pular camadas** (ex: controller → repository direto)
2. **Colocar lógica de negócio no controller** (pertence ao domain/use case)
3. **Retornar entidades diretamente** do controller (usar DTOs)
4. **Usar `any` type**
5. **Confundir Domain Errors com HTTP Errors**
6. **Esquecer de configurar BaseEntity** nos testes

---

## Troubleshooting

### BaseEntity não configurado
```typescript
// Adicionar no beforeAll dos testes
beforeAll(() => {
  BaseEntity.configure({
    id_generator: new ULIDXIDGeneratorService(),
  });
});

// Adicionar no server.ts
BaseEntity.configure({
  id_generator: new ULIDXIDGeneratorService(),
});
```

### Path alias não funciona
```json
// Verificar tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}

// Verificar vitest.config.ts
{
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  }
}
```

---

**Última atualização**: 2024-01-15
