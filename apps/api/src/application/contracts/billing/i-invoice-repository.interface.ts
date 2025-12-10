import { InvoiceEntity, InvoiceStatus } from '@/domain/entities/billing/invoice.entity';

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
  find_by_status(status: InvoiceStatus): Promise<InvoiceEntity[]>;
  list_all(): Promise<InvoiceEntity[]>;
}
