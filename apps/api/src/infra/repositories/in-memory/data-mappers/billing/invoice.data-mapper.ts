import { InvoiceEntity, InvoiceLineItem, InvoiceStatus } from '@/domain/entities/billing/invoice.entity';

export interface InvoicePersistence {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  line_items: InvoiceLineItem[];
  due_date: Date;
  paid_at?: Date;
  provider_invoice_id?: string;
  metadata?: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

export class InvoiceDataMapper {
  static toDomain(raw: InvoicePersistence): InvoiceEntity {
    return new InvoiceEntity({
      id: raw.id,
      user_id: raw.user_id,
      subscription_id: raw.subscription_id,
      amount: raw.amount,
      currency: raw.currency,
      status: raw.status,
      line_items: raw.line_items,
      due_date: raw.due_date,
      paid_at: raw.paid_at,
      provider_invoice_id: raw.provider_invoice_id,
      metadata: raw.metadata,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
    });
  }

  static toPersistence(entity: InvoiceEntity): InvoicePersistence {
    return {
      id: entity.id,
      user_id: entity.user_id,
      subscription_id: entity.subscription_id,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      line_items: entity.line_items,
      due_date: entity.due_date,
      paid_at: entity.paid_at,
      provider_invoice_id: entity.provider_invoice_id,
      metadata: entity.metadata,
      created_at: entity.created_at,
      updated_at: entity.updated_at,
    };
  }
}
