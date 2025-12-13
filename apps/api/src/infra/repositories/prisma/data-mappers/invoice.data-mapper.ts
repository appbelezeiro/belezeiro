import { Invoice as PrismaInvoice, InvoiceStatus as PrismaInvoiceStatus, Prisma } from '@prisma/client';
import { InvoiceEntity, InvoiceStatus, InvoiceLineItem } from '@/domain/entities/billing/invoice.entity.js';

const statusToPrisma: Record<InvoiceStatus, PrismaInvoiceStatus> = {
  [InvoiceStatus.OPEN]: 'open',
  [InvoiceStatus.PAID]: 'paid',
  [InvoiceStatus.UNCOLLECTIBLE]: 'uncollectible',
  [InvoiceStatus.VOID]: 'void',
};

const statusFromPrisma: Record<PrismaInvoiceStatus, InvoiceStatus> = {
  open: InvoiceStatus.OPEN,
  paid: InvoiceStatus.PAID,
  uncollectible: InvoiceStatus.UNCOLLECTIBLE,
  void: InvoiceStatus.VOID,
};

export class InvoiceDataMapper {
  static toDomain(raw: PrismaInvoice): InvoiceEntity {
    return new InvoiceEntity({
      id: raw.id,
      user_id: raw.user_id,
      subscription_id: raw.subscription_id,
      amount: raw.amount,
      currency: raw.currency,
      status: statusFromPrisma[raw.status],
      line_items: raw.line_items as InvoiceLineItem[],
      due_date: raw.due_date,
      paid_at: raw.paid_at ?? undefined,
      provider_invoice_id: raw.provider_invoice_id ?? undefined,
      metadata: raw.metadata as Record<string, any> | undefined,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPrisma(entity: InvoiceEntity): Prisma.InvoiceUncheckedUpdateInput {
    return {
      id: entity.id,
      user_id: entity.user_id,
      subscription_id: entity.subscription_id,
      amount: entity.amount,
      currency: entity.currency,
      status: statusToPrisma[entity.status],
      line_items: entity.line_items as Prisma.InputJsonValue,
      due_date: entity.due_date,
      paid_at: entity.paid_at ?? null,
      provider_invoice_id: entity.provider_invoice_id ?? null,
      metadata: entity.metadata ? (entity.metadata as Prisma.InputJsonValue) : Prisma.JsonNull,
    };
  }

  static toPrismaCreate(entity: InvoiceEntity): Prisma.InvoiceUncheckedCreateInput {
    return {
      ...InvoiceDataMapper.toPrisma(entity),
      created_at: entity.created_at,
    } as Prisma.InvoiceUncheckedCreateInput;
  }
}
