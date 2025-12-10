import { InvoiceStatus, InvoiceLineItem } from '@/domain/entities/invoice.entity';

export interface InvoiceDTO {
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

export interface InvoiceListItemDTO {
  id: string;
  user_id: string;
  subscription_id: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  due_date: Date;
  paid_at?: Date;
}
