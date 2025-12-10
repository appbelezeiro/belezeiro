import { InvoiceEntity } from '@/domain/entities/billing/invoice.entity';
import { InvoiceDTO, InvoiceListItemDTO } from '../../billing/invoice.dto';

export class InvoiceMapper {
  static toDTO(entity: InvoiceEntity): InvoiceDTO {
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

  static toListItem(entity: InvoiceEntity): InvoiceListItemDTO {
    return {
      id: entity.id,
      user_id: entity.user_id,
      subscription_id: entity.subscription_id,
      amount: entity.amount,
      currency: entity.currency,
      status: entity.status,
      due_date: entity.due_date,
      paid_at: entity.paid_at,
    };
  }

  static toDTOList(entities: InvoiceEntity[]): InvoiceDTO[] {
    return entities.map(this.toDTO);
  }

  static toListItemList(entities: InvoiceEntity[]): InvoiceListItemDTO[] {
    return entities.map(this.toListItem);
  }
}
