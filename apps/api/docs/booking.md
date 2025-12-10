# Booking Module Documentation

Este documento descreve o módulo completo de Booking (agendamento), incluindo regras, exceções e disponibilidade.

## Visão Geral

O módulo de Booking permite:

1. **BookingRules**: Definir regras de disponibilidade (semanais ou datas específicas)
2. **BookingExceptions**: Criar exceções que bloqueiam ou substituem regras
3. **Bookings**: Criar e cancelar agendamentos
4. **Availability**: Consultar dias e slots disponíveis

## Prioridade de Aplicação

Ao calcular disponibilidade para um dia, a seguinte prioridade é aplicada:

1. **BookingException type="block"** → Dia completamente bloqueado
2. **BookingException type="override"** → Substitui todas as rules do dia
3. **BookingRule type="specific_date"** → Regras específicas para um dia
4. **BookingRule type="weekly"** → Regras semanais (se weekday coincide)

Após consolidar os intervalos de disponibilidade, bookings confirmados são removidos dos intervalos.

## Endpoints

Base path: `/booking`

### Booking Rules

#### POST /booking/rules

Criar uma nova regra de disponibilidade.

**Request:**
```json
{
  "user_id": "usr_01HXX...",
  "type": "weekly",
  "weekday": 2,
  "start_time": "2025-01-01T10:00:00.000Z",
  "end_time": "2025-01-01T18:00:00.000Z",
  "slot_duration_minutes": 60,
  "metadata": {}
}
```

**Campos:**
- `user_id` (string, required): ID do usuário dono da agenda
- `type` (string, required): "weekly" ou "specific_date"
- `weekday` (number, optional): 0=domingo, 6=sábado (somente para weekly)
- `date` (string, optional): YYYY-MM-DD (somente para specific_date)
- `start_time` (string, required): ISO timestamp
- `end_time` (string, required): ISO timestamp
- `slot_duration_minutes` (number, required): Duração de cada slot
- `metadata` (object, optional): Dados adicionais

**Response:** 201
```json
{
  "id": "brl_01HXX...",
  "user_id": "usr_01HXX...",
  "type": "weekly",
  "weekday": 2,
  "start_time": "2025-01-01T10:00:00.000Z",
  "end_time": "2025-01-01T18:00:00.000Z",
  "slot_duration_minutes": 60,
  "metadata": {},
  "created_at": "2025-01-13T10:00:00.000Z",
  "updated_at": "2025-01-13T10:00:00.000Z"
}
```

#### GET /booking/rules?user_id=xxx

Listar regras de um usuário.

**Response:** 200
```json
{
  "items": [
    {
      "id": "brl_01HXX...",
      "type": "weekly",
      "weekday": 2,
      "start_time": "2025-01-01T10:00:00.000Z",
      "end_time": "2025-01-01T18:00:00.000Z",
      "slot_duration_minutes": 60
    }
  ],
  "total": 1
}
```

#### PUT /booking/rules/:id

Atualizar uma regra.

**Request:**
```json
{
  "start_time": "2025-01-01T09:00:00.000Z",
  "end_time": "2025-01-01T17:00:00.000Z"
}
```

**Response:** 200 (mesma estrutura do POST)

#### DELETE /booking/rules/:id

Deletar uma regra.

**Response:** 204

### Booking Exceptions

#### POST /booking/exceptions

Criar uma exceção (bloqueio ou override).

**Request (block):**
```json
{
  "user_id": "usr_01HXX...",
  "date": "2026-01-04",
  "type": "block",
  "reason": "Feriado"
}
```

**Request (override):**
```json
{
  "user_id": "usr_01HXX...",
  "date": "2025-12-20",
  "type": "override",
  "start_time": "2025-12-20T08:00:00.000Z",
  "end_time": "2025-12-20T10:00:00.000Z",
  "slot_duration_minutes": 60,
  "reason": "Horário especial"
}
```

**Response:** 201
```json
{
  "id": "bex_01HXX...",
  "user_id": "usr_01HXX...",
  "date": "2026-01-04",
  "type": "block",
  "reason": "Feriado",
  "created_at": "2025-01-13T10:00:00.000Z",
  "updated_at": "2025-01-13T10:00:00.000Z"
}
```

#### GET /booking/exceptions?user_id=xxx&date=YYYY-MM-DD

Listar exceções de um usuário (opcionalmente filtrado por data).

**Response:** 200
```json
{
  "items": [
    {
      "id": "bex_01HXX...",
      "date": "2026-01-04",
      "type": "block",
      "reason": "Feriado"
    }
  ],
  "total": 1
}
```

#### PUT /booking/exceptions/:id

Atualizar uma exceção.

**Response:** 200

#### DELETE /booking/exceptions/:id

Deletar uma exceção.

**Response:** 204

### Availability

#### GET /booking/available-days?user_id=xxx&days_ahead=45

Retornar dias com disponibilidade.

**Response:** 200
```json
{
  "days": [
    "2025-01-13",
    "2025-01-15",
    "2025-01-20"
  ]
}
```

#### GET /booking/available-slots?user_id=xxx&date=2025-01-13

Retornar slots disponíveis para um dia específico.

**Response:** 200
```json
{
  "date": "2025-01-13",
  "slots": [
    { "start": "10:00", "end": "11:00" },
    { "start": "11:00", "end": "12:00" },
    { "start": "14:00", "end": "15:00" }
  ]
}
```

### Bookings

#### POST /booking

Criar um novo agendamento.

**Request:**
```json
{
  "user_id": "usr_01HXX...",
  "client_id": "usr_02HXX...",
  "start_at": "2025-01-13T10:00:00.000Z",
  "end_at": "2025-01-13T11:00:00.000Z"
}
```

**Validações:**
- `start_at < end_at`
- Não há overlapping com bookings confirmados existentes
- Slot está disponível (dentro de rules/exceptions e não ocupado)

**Response:** 201
```json
{
  "booking_id": "book_01HXX...",
  "status": "confirmed"
}
```

**Errors:**
- 400: `InvalidTimeRangeError` - start_at >= end_at
- 400: `SlotNotAvailableError` - Slot não está disponível
- 409: `BookingOverlapError` - Conflito com booking existente

#### POST /booking/:id/cancel

Cancelar um agendamento.

**Response:** 200
```json
{
  "booking_id": "book_01HXX...",
  "status": "cancelled"
}
```

**Errors:**
- 404: `BookingNotFoundError` - Booking não encontrado

## Proteção Contra Double-Booking

O sistema implementa proteção em 3 camadas:

### 1. Domínio

O UseCase `CreateBookingUseCase` verifica overlap com `find_overlapping()` antes de criar.

### 2. Repositório (Lock)

O repositório in-memory implementa um mutex simples para prevenir race conditions:

```typescript
// InMemoryBookingRepository
private locks: Map<string, Promise<void>> = new Map();

async create(entity: BookingEntity): Promise<BookingEntity> {
  const release = await this.acquire_lock(entity.user_id);
  try {
    // ... create logic
  } finally {
    release();
  }
}
```

### 3. Banco de Dados (Futura)

Quando migrar para Postgres, adicionar constraint:

```sql
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings ADD CONSTRAINT no_overlapping_bookings
  EXCLUDE USING GIST (
    user_id WITH =,
    tstzrange(start_at, end_at) WITH &&
  )
  WHERE (status = 'confirmed');
```

## Formato de Tempo

- **Armazenamento**: Timestamps ISO 8601 completos (ex: `2025-01-13T10:00:00.000Z`)
- **Normalização**: Segundos e milissegundos sempre zerados
- **Timezone**: UTC
- **Display**: HH:mm (ex: `10:00`, `14:30`)

## Bookings Longos

Bookings podem ter durações arbitrárias (ex: 90 minutos) e ocupar múltiplos slots:

- Ao criar booking, verifica-se se o intervalo `[start_at, end_at)` está completamente contido nos intervalos permitidos
- Ao gerar slots, bookings longos são subtraídos dos intervalos disponíveis

## Exemplos de Uso

### Exemplo 1: Agenda Semanal Simples

```bash
# 1. Criar regra semanal: terças 10:00-18:00, slots de 60min
POST /booking/rules
{
  "user_id": "usr_123",
  "type": "weekly",
  "weekday": 2,
  "start_time": "2025-01-01T10:00:00.000Z",
  "end_time": "2025-01-01T18:00:00.000Z",
  "slot_duration_minutes": 60
}

# 2. Consultar dias disponíveis (próximos 30 dias)
GET /booking/available-days?user_id=usr_123&days_ahead=30

# 3. Consultar slots para uma terça específica
GET /booking/available-slots?user_id=usr_123&date=2025-01-14

# 4. Criar booking
POST /booking
{
  "user_id": "usr_123",
  "client_id": "usr_456",
  "start_at": "2025-01-14T10:00:00.000Z",
  "end_at": "2025-01-14T11:00:00.000Z"
}
```

### Exemplo 2: Override para Dia Especial

```bash
# 1. Criar override para 20/12: horário especial 08:00-10:00
POST /booking/exceptions
{
  "user_id": "usr_123",
  "date": "2025-12-20",
  "type": "override",
  "start_time": "2025-12-20T08:00:00.000Z",
  "end_time": "2025-12-20T10:00:00.000Z",
  "slot_duration_minutes": 60,
  "reason": "Plantão especial"
}

# 2. Consultar slots para este dia (vai ignorar rules semanais)
GET /booking/available-slots?user_id=usr_123&date=2025-12-20
# Retorna: [{ "start": "08:00", "end": "09:00" }, { "start": "09:00", "end": "10:00" }]
```

### Exemplo 3: Bloquear Feriado

```bash
# Bloquear 01/01
POST /booking/exceptions
{
  "user_id": "usr_123",
  "date": "2026-01-01",
  "type": "block",
  "reason": "Ano Novo"
}

# Consultar slots (vai retornar vazio)
GET /booking/available-slots?user_id=usr_123&date=2026-01-01
# Retorna: { "date": "2026-01-01", "slots": [] }
```

## Migração de Schemas Antigos

Este módulo substitui os schemas antigos:
- `schedule-rule` → `booking-rule`
- `schedule-exception` → `booking-exception`

Principais mudanças:
- Nomenclatura mais clara
- Suporte completo a bookings longos
- Proteção contra double-booking em 3 camadas
- Priorização clara de regras/exceções

## Notas Técnicas

- Todos os repositórios são in-memory por padrão
- Use data mappers para futura migração para Postgres
- AvailabilityService centraliza lógica de disponibilidade
- Todos os use cases validam entrada e lançam domain errors apropriados
- Controllers transformam domain errors em HTTP errors

---

**Última atualização**: 2025-01-13
**Versão**: 1.0.0
