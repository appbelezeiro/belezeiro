import { IInvoiceRepository } from '@/application/contracts/billing/i-invoice-repository.interface.js';
import { InvoiceEntity, InvoiceStatus } from '@/domain/entities/billing/invoice.entity.js';
import { prisma } from '../client/index.js';
import { InvoiceDataMapper } from '../data-mappers/index.js';
import { InvoiceStatus as PrismaInvoiceStatus } from '@prisma/client';

const statusToPrisma: Record<InvoiceStatus, PrismaInvoiceStatus> = {
  [InvoiceStatus.OPEN]: 'open',
  [InvoiceStatus.PAID]: 'paid',
  [InvoiceStatus.UNCOLLECTIBLE]: 'uncollectible',
  [InvoiceStatus.VOID]: 'void',
};

export class PrismaInvoiceRepository implements IInvoiceRepository {
  async create(entity: InvoiceEntity): Promise<InvoiceEntity> {
    const data = InvoiceDataMapper.toPrismaCreate(entity);
    const created = await prisma.invoice.create({ data });
    return InvoiceDataMapper.toDomain(created);
  }

  async find_by_id(id: string): Promise<InvoiceEntity | null> {
    const found = await prisma.invoice.findUnique({ where: { id } });
    return found ? InvoiceDataMapper.toDomain(found) : null;
  }

  async find_by_subscription_id(subscription_id: string): Promise<InvoiceEntity[]> {
    const invoices = await prisma.invoice.findMany({
      where: { subscription_id },
      orderBy: { created_at: 'desc' },
    });
    return invoices.map(InvoiceDataMapper.toDomain);
  }

  async find_by_user_id(user_id: string): Promise<InvoiceEntity[]> {
    const invoices = await prisma.invoice.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
    });
    return invoices.map(InvoiceDataMapper.toDomain);
  }

  async find_by_provider_id(provider_id: string): Promise<InvoiceEntity | null> {
    const found = await prisma.invoice.findFirst({
      where: { provider_invoice_id: provider_id },
    });
    return found ? InvoiceDataMapper.toDomain(found) : null;
  }

  async update(entity: InvoiceEntity): Promise<InvoiceEntity> {
    const data = InvoiceDataMapper.toPrisma(entity);
    const updated = await prisma.invoice.update({
      where: { id: entity.id },
      data,
    });
    return InvoiceDataMapper.toDomain(updated);
  }

  async delete(id: string): Promise<boolean> {
    try {
      await prisma.invoice.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  }

  async find_overdue(): Promise<InvoiceEntity[]> {
    const now = new Date();
    const invoices = await prisma.invoice.findMany({
      where: {
        status: 'open',
        due_date: { lt: now },
      },
      orderBy: { due_date: 'asc' },
    });
    return invoices.map(InvoiceDataMapper.toDomain);
  }

  async find_unpaid_by_user(user_id: string): Promise<InvoiceEntity[]> {
    const invoices = await prisma.invoice.findMany({
      where: {
        user_id,
        status: { in: ['open', 'uncollectible'] },
      },
      orderBy: { due_date: 'asc' },
    });
    return invoices.map(InvoiceDataMapper.toDomain);
  }

  async find_by_status(status: InvoiceStatus): Promise<InvoiceEntity[]> {
    const invoices = await prisma.invoice.findMany({
      where: { status: statusToPrisma[status] },
      orderBy: { created_at: 'desc' },
    });
    return invoices.map(InvoiceDataMapper.toDomain);
  }

  async list_all(): Promise<InvoiceEntity[]> {
    const invoices = await prisma.invoice.findMany({
      orderBy: { created_at: 'desc' },
    });
    return invoices.map(InvoiceDataMapper.toDomain);
  }
}
