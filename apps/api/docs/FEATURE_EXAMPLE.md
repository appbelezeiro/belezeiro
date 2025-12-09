# Exemplo Completo: Feature "Task"

Este documento mostra passo-a-passo como criar uma feature completa do zero no projeto.

## Objetivo

Criar um sistema de tasks (tarefas) onde:
- Usuários podem criar tasks
- Tasks têm título, descrição, status (pending/completed)
- Tasks pertencem a um usuário
- Usuários podem listar suas tasks
- Usuários podem marcar tasks como completas

---

## Passo 1: Domain Entity

### 1.1 Criar Entity

**Arquivo**: `src/domain/entities/task.entity.ts`

```typescript
import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from './base.entity';

export type TaskStatus = 'pending' | 'completed';

type TaskEntityOwnProps = {
  user_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  completed_at?: Date;
};

type TaskEntityCreationProps = Omit<TaskEntityOwnProps, 'status' | 'completed_at'> &
  Partial<Pick<TaskEntityOwnProps, 'status' | 'completed_at'>> &
  BaseEntityCreationProps;

type TaskEntityProps = Required<Pick<TaskEntityOwnProps, 'user_id' | 'title' | 'status'>> &
  Partial<Pick<TaskEntityOwnProps, 'description' | 'completed_at'>> &
  BaseEntityProps;

export class TaskEntity extends BaseEntity<TaskEntityProps> {
  protected prefix(): string {
    return 'tsk';
  }

  constructor(props: TaskEntityCreationProps) {
    super({
      ...props,
      status: props.status ?? 'pending',
      completed_at: props.completed_at,
    });
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get title(): string {
    return this.props.title;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get status(): TaskStatus {
    return this.props.status;
  }

  get completed_at(): Date | undefined {
    return this.props.completed_at;
  }

  update_title(new_title: string): void {
    this.props.title = new_title;
    this.touch();
  }

  update_description(new_description: string): void {
    this.props.description = new_description;
    this.touch();
  }

  mark_as_completed(): void {
    this.props.status = 'completed';
    this.props.completed_at = new Date();
    this.touch();
  }

  mark_as_pending(): void {
    this.props.status = 'pending';
    this.props.completed_at = undefined;
    this.touch();
  }
}
```

---

## Passo 2: Repository Interface

### 2.1 Criar Interface

**Arquivo**: `src/application/contracts/i-task-repository.interface.ts`

```typescript
import { TaskEntity } from '@/domain/entities/task.entity';

export interface ITaskRepository {
  create(task: TaskEntity): Promise<TaskEntity>;
  find_by_id(id: string): Promise<TaskEntity | null>;
  find_by_user_id(user_id: string): Promise<TaskEntity[]>;
  list_all(): Promise<TaskEntity[]>;
  update(task: TaskEntity): Promise<TaskEntity>;
  delete(id: string): Promise<boolean>;
}
```

---

## Passo 3: Use Cases

### 3.1 CreateTaskUseCase

**Arquivo**: `src/application/usecases/create-task.usecase.ts`

```typescript
import { TaskEntity } from '@/domain/entities/task.entity';
import { ITaskRepository } from '@/application/contracts/i-task-repository.interface';

class UseCase {
  constructor(private readonly task_repository: ITaskRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const task = new TaskEntity({
      user_id: input.user_id,
      title: input.title,
      description: input.description,
    });

    return this.task_repository.create(task);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
    title: string;
    description?: string;
  };

  export type Output = Promise<TaskEntity>;
}

export { UseCase as CreateTaskUseCase };
```

### 3.2 GetTasksByUserUseCase

**Arquivo**: `src/application/usecases/get-tasks-by-user.usecase.ts`

```typescript
import { TaskEntity } from '@/domain/entities/task.entity';
import { ITaskRepository } from '@/application/contracts/i-task-repository.interface';

class UseCase {
  constructor(private readonly task_repository: ITaskRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    return this.task_repository.find_by_user_id(input.user_id);
  }
}

declare namespace UseCase {
  export type Input = {
    user_id: string;
  };

  export type Output = Promise<TaskEntity[]>;
}

export { UseCase as GetTasksByUserUseCase };
```

### 3.3 CompleteTaskUseCase

**Arquivo**: `src/application/usecases/complete-task.usecase.ts`

```typescript
import { TaskEntity } from '@/domain/entities/task.entity';
import { ITaskRepository } from '@/application/contracts/i-task-repository.interface';

class UseCase {
  constructor(private readonly task_repository: ITaskRepository) {}

  async execute(input: UseCase.Input): UseCase.Output {
    const task = await this.task_repository.find_by_id(input.task_id);

    if (!task) {
      throw new Error('Task not found');
    }

    task.mark_as_completed();

    return this.task_repository.update(task);
  }
}

declare namespace UseCase {
  export type Input = {
    task_id: string;
  };

  export type Output = Promise<TaskEntity>;
}

export { UseCase as CompleteTaskUseCase };
```

---

## Passo 4: Data Mapper

### 4.1 Criar Data Mapper

**Arquivo**: `src/infra/repositories/in-memory/data-mappers/task.data-mapper.ts`

```typescript
import { TaskEntity, TaskStatus } from '@/domain/entities/task.entity';

export interface TaskPersistence {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  completed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export class TaskDataMapper {
  static toDomain(raw: TaskPersistence): TaskEntity {
    return new TaskEntity({
      id: raw.id,
      user_id: raw.user_id,
      title: raw.title,
      description: raw.description,
      status: raw.status,
      completed_at: raw.completed_at,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: TaskEntity): TaskPersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      title: entity.title,
      description: entity.description,
      status: entity.status,
      completed_at: entity.completed_at,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
```

---

## Passo 5: Repository Implementation

### 5.1 Criar InMemoryTaskRepository

**Arquivo**: `src/infra/repositories/in-memory/in-memory-task.repository.ts`

```typescript
import { TaskEntity } from '@/domain/entities/task.entity';
import { ITaskRepository } from '@/application/contracts/i-task-repository.interface';
import { TaskDataMapper, TaskPersistence } from './data-mappers/task.data-mapper';

export class InMemoryTaskRepository implements ITaskRepository {
  private tasks: TaskPersistence[] = [];

  async create(task: TaskEntity): Promise<TaskEntity> {
    const persistence = TaskDataMapper.toPersistence(task);
    this.tasks.push(persistence);
    return TaskDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<TaskEntity | null> {
    const task = this.tasks.find((t) => t.id === id);
    return task ? TaskDataMapper.toDomain(task) : null;
  }

  async find_by_user_id(user_id: string): Promise<TaskEntity[]> {
    return this.tasks
      .filter((t) => t.user_id === user_id)
      .map(TaskDataMapper.toDomain);
  }

  async list_all(): Promise<TaskEntity[]> {
    return this.tasks.map(TaskDataMapper.toDomain);
  }

  async update(task: TaskEntity): Promise<TaskEntity> {
    const index = this.tasks.findIndex((t) => t.id === task.id);
    if (index === -1) {
      throw new Error(`Task with id ${task.id} not found`);
    }

    const persistence = TaskDataMapper.toPersistence(task);
    this.tasks[index] = persistence;
    return TaskDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.tasks.findIndex((t) => t.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    return true;
  }
}
```

---

## Passo 6: Controller

### 6.1 Criar TaskController

**Arquivo**: `src/infra/http/controllers/task.controller.ts`

```typescript
import { Context } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { z } from 'zod';
import { NotFoundError } from '../errors/http-errors';

const CreateTaskSchema = z.object({
  user_id: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
});

const CompleteTaskSchema = z.object({
  task_id: z.string().min(1),
});

export class TaskController {
  constructor(private readonly container: Container) {}

  async create(c: Context) {
    const body = await c.req.json();
    const payload = CreateTaskSchema.parse(body);

    const task = await this.container.use_cases.create_task.execute({
      user_id: payload.user_id,
      title: payload.title,
      description: payload.description,
    });

    return c.json(
      {
        id: task.id,
        user_id: task.user_id,
        title: task.title,
        description: task.description,
        status: task.status,
        created_at: task.created_at,
      },
      201,
    );
  }

  async list_by_user(c: Context) {
    const { user_id } = c.req.param();

    const tasks = await this.container.use_cases.get_tasks_by_user.execute({
      user_id,
    });

    return c.json({
      items: tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        completed_at: task.completed_at,
        created_at: task.created_at,
      })),
      total: tasks.length,
    });
  }

  async complete(c: Context) {
    const { task_id } = c.req.param();

    const task = await this.container.use_cases.complete_task.execute({
      task_id,
    });

    if (!task) {
      throw new NotFoundError('Task not found');
    }

    return c.json({
      id: task.id,
      title: task.title,
      status: task.status,
      completed_at: task.completed_at,
    });
  }
}
```

---

## Passo 7: Routes

### 7.1 Criar Routes

**Arquivo**: `src/infra/http/routes/task.routes.ts`

```typescript
import { Hono } from 'hono';
import type { Container } from '@/infra/di/factory-root';
import { TaskController } from '../controllers/task.controller';

export function createTaskRoutes(container: Container) {
  const router = new Hono();
  const controller = new TaskController(container);

  router.post('/', (context) => controller.create(context));
  router.get('/user/:user_id', (context) => controller.list_by_user(context));
  router.patch('/:task_id/complete', (context) => controller.complete(context));

  return router;
}
```

### 7.2 Registrar Routes

**Arquivo**: `src/infra/http/routes/index.ts`

```typescript
import type { Container } from '@/infra/di/factory-root';
import { Hono } from 'hono';
import { createUserRoutes } from './user.routes';
import { createScheduleRoutes } from './schedule.routes';
import { createTaskRoutes } from './task.routes';  // ← Adicionar

export function createRoutes(container: Container) {
  const app = new Hono();

  app.route('/users', createUserRoutes(container));
  app.route('/schedules', createScheduleRoutes(container));
  app.route('/tasks', createTaskRoutes(container));  // ← Adicionar

  return app;
}
```

---

## Passo 8: Dependency Injection

### 8.1 Adicionar ao Repositories Factory

**Arquivo**: `src/infra/di/factories/repositories.factory.ts`

```typescript
import { InMemoryUserRepository } from '@/infra/repositories/in-memory/in-memory-user.repository';
import { InMemoryScheduleRuleRepository } from '@/infra/repositories/in-memory/in-memory-schedule-rule.repository';
import { InMemoryScheduleExceptionRepository } from '@/infra/repositories/in-memory/in-memory-schedule-exception.repository';
import { InMemoryScheduleRepository } from '@/infra/repositories/in-memory/in-memory-schedule.repository';
import { InMemoryTaskRepository } from '@/infra/repositories/in-memory/in-memory-task.repository';  // ← Adicionar
import type { Clients } from './clients.factory';

export function createRepositories(_clients: Clients) {
  const user_repository = new InMemoryUserRepository();
  const schedule_rule_repository = new InMemoryScheduleRuleRepository();
  const schedule_exception_repository = new InMemoryScheduleExceptionRepository();
  const schedule_repository = new InMemoryScheduleRepository();
  const task_repository = new InMemoryTaskRepository();  // ← Adicionar

  return {
    user_repository,
    schedule_rule_repository,
    schedule_exception_repository,
    schedule_repository,
    task_repository,  // ← Adicionar
  };
}

export type Repositories = ReturnType<typeof createRepositories>;
```

### 8.2 Adicionar ao Use Cases Factory

**Arquivo**: `src/infra/di/factories/use-cases.factory.ts`

```typescript
import { CreateUserUseCase } from '@/application/usecases/create-user.usecase';
import { CreateScheduleRuleUseCase } from '@/application/usecases/create-schedule-rule.usecase';
import { GetScheduleRulesByUserUseCase } from '@/application/usecases/get-schedule-rules-by-user.usecase';
import { CreateScheduleExceptionUseCase } from '@/application/usecases/create-schedule-exception.usecase';
import { GetScheduleExceptionsByUserUseCase } from '@/application/usecases/get-schedule-exceptions-by-user.usecase';
import { GetSlotsByDayUseCase } from '@/application/usecases/get-slots-by-day.usecase';
import { CreateTaskUseCase } from '@/application/usecases/create-task.usecase';  // ← Adicionar
import { GetTasksByUserUseCase } from '@/application/usecases/get-tasks-by-user.usecase';  // ← Adicionar
import { CompleteTaskUseCase } from '@/application/usecases/complete-task.usecase';  // ← Adicionar
import type { Repositories } from './repositories.factory';

export function createUseCases(repositories: Repositories) {
  return {
    // User use cases
    create_user: new CreateUserUseCase(repositories.user_repository),

    // Schedule Rule use cases
    create_schedule_rule: new CreateScheduleRuleUseCase(repositories.schedule_rule_repository),
    get_schedule_rules_by_user: new GetScheduleRulesByUserUseCase(repositories.schedule_rule_repository),

    // Schedule Exception use cases
    create_schedule_exception: new CreateScheduleExceptionUseCase(repositories.schedule_exception_repository),
    get_schedule_exceptions_by_user: new GetScheduleExceptionsByUserUseCase(
      repositories.schedule_exception_repository,
    ),

    // Schedule use cases
    get_slots_by_day: new GetSlotsByDayUseCase(repositories.schedule_repository),

    // Task use cases  ← Adicionar
    create_task: new CreateTaskUseCase(repositories.task_repository),
    get_tasks_by_user: new GetTasksByUserUseCase(repositories.task_repository),
    complete_task: new CompleteTaskUseCase(repositories.task_repository),
  };
}

export type UseCases = ReturnType<typeof createUseCases>;
```

---

## Passo 9: Testes Unitários

### 9.1 Teste do CreateTaskUseCase

**Arquivo**: `src/application/usecases/create-task.usecase.spec.ts`

```typescript
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CreateTaskUseCase } from './create-task.usecase';
import { InMemoryTaskRepository } from '@/infra/repositories/in-memory/in-memory-task.repository';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CreateTaskUseCase', () => {
  let sut: CreateTaskUseCase;
  let task_repository: InMemoryTaskRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    task_repository = new InMemoryTaskRepository();
    sut = new CreateTaskUseCase(task_repository);
  });

  it('should create a new task', async () => {
    const input = {
      user_id: 'usr_123',
      title: 'My first task',
      description: 'Task description',
    };

    const task = await sut.execute(input);

    expect(task.title).toBe('My first task');
    expect(task.description).toBe('Task description');
    expect(task.user_id).toBe('usr_123');
    expect(task.status).toBe('pending');
    expect(task.id).toContain('tsk_');
    expect(task.completed_at).toBeUndefined();
  });

  it('should create a task without description', async () => {
    const input = {
      user_id: 'usr_123',
      title: 'My task',
    };

    const task = await sut.execute(input);

    expect(task.title).toBe('My task');
    expect(task.description).toBeUndefined();
    expect(task.status).toBe('pending');
  });
});
```

### 9.2 Teste do CompleteTaskUseCase

**Arquivo**: `src/application/usecases/complete-task.usecase.spec.ts`

```typescript
import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { CompleteTaskUseCase } from './complete-task.usecase';
import { InMemoryTaskRepository } from '@/infra/repositories/in-memory/in-memory-task.repository';
import { TaskEntity } from '@/domain/entities/task.entity';
import { BaseEntity } from '@/domain/entities/base.entity';
import { ULIDXIDGeneratorService } from '@/infra/services/ulidx-id-generator.service';

describe('CompleteTaskUseCase', () => {
  let sut: CompleteTaskUseCase;
  let task_repository: InMemoryTaskRepository;

  beforeAll(() => {
    BaseEntity.configure({
      id_generator: new ULIDXIDGeneratorService(),
    });
  });

  beforeEach(() => {
    task_repository = new InMemoryTaskRepository();
    sut = new CompleteTaskUseCase(task_repository);
  });

  it('should mark task as completed', async () => {
    const task = new TaskEntity({
      user_id: 'usr_123',
      title: 'Test task',
    });
    await task_repository.create(task);

    const result = await sut.execute({ task_id: task.id });

    expect(result.status).toBe('completed');
    expect(result.completed_at).toBeInstanceOf(Date);
  });

  it('should throw error if task not found', async () => {
    await expect(
      sut.execute({ task_id: 'tsk_invalid' })
    ).rejects.toThrow('Task not found');
  });
});
```

---

## Passo 10: Testes E2E

### 10.1 Teste E2E de Tasks

**Arquivo**: `__tests__/e2e/task.e2e.spec.ts`

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestServer } from '../helpers/test-server';

describe('Task E2E', () => {
  let server: ReturnType<typeof createTestServer>;

  beforeEach(() => {
    server = createTestServer();
  });

  describe('POST /api/tasks', () => {
    it('should create a new task successfully', async () => {
      const response = await server
        .post('/api/tasks')
        .send({
          user_id: 'usr_123',
          title: 'My first task',
          description: 'Task description',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('title', 'My first task');
      expect(response.body).toHaveProperty('description', 'Task description');
      expect(response.body).toHaveProperty('status', 'pending');
      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should return 422 if required fields are missing', async () => {
      const response = await server
        .post('/api/tasks')
        .send({
          user_id: 'usr_123',
        })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(422);
      expect(response.body).toHaveProperty('error', 'VALIDATION_ERROR');
      expect(response.body).toHaveProperty('details', expect.arrayContaining([
        expect.objectContaining({
          field: 'title',
        }),
      ]));
    });
  });

  describe('GET /api/tasks/user/:user_id', () => {
    it('should return all tasks for a user', async () => {
      // Create tasks
      await server.post('/api/tasks').send({
        user_id: 'usr_123',
        title: 'Task 1',
      });
      await server.post('/api/tasks').send({
        user_id: 'usr_123',
        title: 'Task 2',
      });

      const response = await server.get('/api/tasks/user/usr_123');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total', 2);
      expect(response.body.items).toHaveLength(2);
    });

    it('should return empty array if user has no tasks', async () => {
      const response = await server.get('/api/tasks/user/usr_999');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items', []);
      expect(response.body).toHaveProperty('total', 0);
    });
  });

  describe('PATCH /api/tasks/:task_id/complete', () => {
    it('should mark task as completed', async () => {
      // Create task
      const createResponse = await server.post('/api/tasks').send({
        user_id: 'usr_123',
        title: 'Task to complete',
      });

      const { id } = createResponse.body;

      // Complete task
      const response = await server.patch(`/api/tasks/${id}/complete`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', id);
      expect(response.body).toHaveProperty('status', 'completed');
      expect(response.body).toHaveProperty('completed_at');
    });

    it('should return 404 if task not found', async () => {
      const response = await server.patch('/api/tasks/tsk_invalid/complete');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'NOT_FOUND');
    });
  });
});
```

---

## Passo 11: Rodar Testes

```bash
# Testes unitários
pnpm test

# Testes E2E
pnpm test:e2e
```

---

## Resumo do que foi criado

### Domain Layer
- ✅ `task.entity.ts` - Entidade de domínio

### Application Layer
- ✅ `i-task-repository.interface.ts` - Interface do repositório
- ✅ `create-task.usecase.ts` - Use case de criação
- ✅ `get-tasks-by-user.usecase.ts` - Use case de listagem
- ✅ `complete-task.usecase.ts` - Use case de completar
- ✅ Testes unitários de todos os use cases

### Infrastructure Layer
- ✅ `task.data-mapper.ts` - Mapeador de dados
- ✅ `in-memory-task.repository.ts` - Implementação do repositório
- ✅ `task.controller.ts` - Controller HTTP
- ✅ `task.routes.ts` - Rotas HTTP
- ✅ Registro no DI (repositories.factory, use-cases.factory, routes/index)
- ✅ Testes E2E

---

## Endpoints Disponíveis

```
POST   /api/tasks                      - Criar task
GET    /api/tasks/user/:user_id        - Listar tasks do usuário
PATCH  /api/tasks/:task_id/complete    - Marcar task como completa
```

---

**Pronto!** Você tem uma feature completa seguindo todos os padrões do projeto.
