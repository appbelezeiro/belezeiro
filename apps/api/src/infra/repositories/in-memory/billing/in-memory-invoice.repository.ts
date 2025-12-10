import { InvoiceEntity, InvoiceStatus } from '@/domain/entities/billing/invoice.entity';
import { IInvoiceRepository } from '@/application/contracts/billing/i-invoice-repository.interface';
import { InvoiceDataMapper, InvoicePersistence } from '../data-mappers/billing/invoice.data-mapper';

export class InMemoryInvoiceRepository implements IInvoiceRepository {
  private items: InvoicePersistence[] = [];

  async create(entity: InvoiceEntity): Promise<InvoiceEntity> {
    const persistence = InvoiceDataMapper.toPersistence(entity);
    this.items.push(persistence);
    return InvoiceDataMapper.toDomain(persistence);
  }

  async find_by_id(id: string): Promise<InvoiceEntity | null> {
    const item = this.items.find((i) => i.id === id);
    return item ? InvoiceDataMapper.toDomain(item) : null;
  }

  async find_by_subscription_id(subscription_id: string): Promise<InvoiceEntity[]> {
    return this.items
      .filter((i) => i.subscription_id === subscription_id)
      .map(InvoiceDataMapper.toDomain);
  }

  async find_by_user_id(user_id: string): Promise<InvoiceEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id)
      .map(InvoiceDataMapper.toDomain);
  }

  async find_by_provider_id(provider_id: string): Promise<InvoiceEntity | null> {
    const item = this.items.find((i) => i.provider_invoice_id === provider_id);
    return item ? InvoiceDataMapper.toDomain(item) : null;
  }

  async update(entity: InvoiceEntity): Promise<InvoiceEntity> {
    const index = this.items.findIndex((i) => i.id === entity.id);
    if (index === -1) {
      throw new Error(`Invoice with id ${entity.id} not found`);
    }

    const persistence = InvoiceDataMapper.toPersistence(entity);
    this.items[index] = persistence;
    return InvoiceDataMapper.toDomain(persistence);
  }

  async delete(id: string): Promise<boolean> {
    const index = this.items.findIndex((i) => i.id === id);
    if (index === -1) return false;

    this.items.splice(index, 1);
    return true;
  }

  async find_overdue(): Promise<InvoiceEntity[]> {
    const now = new Date();
    return this.items
      .filter((i) => i.status === InvoiceStatus.OPEN && i.due_date < now)
      .map(InvoiceDataMapper.toDomain);
  }

  async find_unpaid_by_user(user_id: string): Promise<InvoiceEntity[]> {
    return this.items
      .filter((i) => i.user_id === user_id && i.status !== InvoiceStatus.PAID)
      .map(InvoiceDataMapper.toDomain);
  }

  async find_by_status(status: InvoiceStatus): Promise<InvoiceEntity[]> {
    return this.items
      .filter((i) => i.status === status)
      .map(InvoiceDataMapper.toDomain);
  }

  async list_all(): Promise<InvoiceEntity[]> {
    return this.items.map(InvoiceDataMapper.toDomain);
  }
}
