import { BaseEntity, BaseEntityCreationProps, BaseEntityProps } from '../base.entity';
import {
  InvoiceAlreadyPaidError,
  InvoiceCannotBeModifiedError,
  InvoiceInvalidStatusError,
} from '@/domain/errors/billing/invoice.errors';

export enum InvoiceStatus {
  OPEN = 'open',
  PAID = 'paid',
  UNCOLLECTIBLE = 'uncollectible',
  VOID = 'void',
}

export type InvoiceLineItem = {
  description: string;
  amount: number;
  quantity: number;
  metadata?: Record<string, any>;
};

type InvoiceEntityOwnProps = {
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
};

type InvoiceEntityCreationProps = Omit<InvoiceEntityOwnProps, 'status'> &
  Partial<Pick<InvoiceEntityOwnProps, 'status'>> &
  BaseEntityCreationProps;

type InvoiceEntityProps = Omit<InvoiceEntityOwnProps, 'paid_at' | 'provider_invoice_id' | 'metadata'> &
  Required<Pick<InvoiceEntityOwnProps, 'status'>> &
  Pick<InvoiceEntityOwnProps, 'paid_at' | 'provider_invoice_id' | 'metadata'> &
  BaseEntityProps;

export class InvoiceEntity extends BaseEntity<InvoiceEntityProps> {
  protected prefix(): string {
    return 'inv';
  }

  constructor(props: InvoiceEntityCreationProps) {
    super({
      ...props,
      status: props.status ?? InvoiceStatus.OPEN,
      paid_at: props.paid_at,
      provider_invoice_id: props.provider_invoice_id,
      metadata: props.metadata,
    });

    this.validate_line_items();
  }

  get user_id(): string {
    return this.props.user_id;
  }

  get subscription_id(): string {
    return this.props.subscription_id;
  }

  get amount(): number {
    return this.props.amount;
  }

  get currency(): string {
    return this.props.currency;
  }

  get status(): InvoiceStatus {
    return this.props.status;
  }

  get line_items(): InvoiceLineItem[] {
    return this.props.line_items;
  }

  get due_date(): Date {
    return this.props.due_date;
  }

  get paid_at(): Date | undefined {
    return this.props.paid_at;
  }

  get provider_invoice_id(): string | undefined {
    return this.props.provider_invoice_id;
  }

  get metadata(): Record<string, any> | undefined {
    return this.props.metadata;
  }

  mark_as_paid(paid_at: Date): void {
    if (this.props.status === InvoiceStatus.PAID) {
      throw new InvoiceAlreadyPaidError('Invoice is already paid');
    }

    if (this.props.status === InvoiceStatus.VOID) {
      throw new InvoiceCannotBeModifiedError('Cannot mark a void invoice as paid');
    }

    this.props.status = InvoiceStatus.PAID;
    this.props.paid_at = paid_at;
    this.touch();
  }

  mark_as_uncollectible(): void {
    if (this.props.status === InvoiceStatus.PAID) {
      throw new InvoiceCannotBeModifiedError('Cannot mark a paid invoice as uncollectible');
    }

    if (this.props.status === InvoiceStatus.VOID) {
      throw new InvoiceCannotBeModifiedError('Cannot mark a void invoice as uncollectible');
    }

    this.props.status = InvoiceStatus.UNCOLLECTIBLE;
    this.touch();
  }

  mark_as_void(): void {
    if (this.props.status === InvoiceStatus.PAID) {
      throw new InvoiceCannotBeModifiedError('Cannot void a paid invoice');
    }

    this.props.status = InvoiceStatus.VOID;
    this.touch();
  }

  update_status(status: InvoiceStatus): void {
    this.props.status = status;
    this.touch();
  }

  is_overdue(): boolean {
    return this.props.status === InvoiceStatus.OPEN && this.props.due_date < new Date();
  }

  is_paid(): boolean {
    return this.props.status === InvoiceStatus.PAID;
  }

  add_line_item(item: InvoiceLineItem): void {
    if (this.props.status !== InvoiceStatus.OPEN) {
      throw new InvoiceCannotBeModifiedError(
        'Cannot add line items to a non-open invoice',
      );
    }

    this.validate_line_item(item);
    this.props.line_items.push(item);
    this.recalculate_amount();
    this.touch();
  }

  remove_line_item(index: number): void {
    if (this.props.status !== InvoiceStatus.OPEN) {
      throw new InvoiceCannotBeModifiedError(
        'Cannot remove line items from a non-open invoice',
      );
    }

    if (index < 0 || index >= this.props.line_items.length) {
      throw new InvoiceInvalidStatusError('Invalid line item index');
    }

    this.props.line_items.splice(index, 1);
    this.recalculate_amount();
    this.touch();
  }

  calculate_total(): number {
    return this.props.line_items.reduce((total, item) => {
      return total + item.amount * item.quantity;
    }, 0);
  }

  update_provider_invoice_id(provider_id: string): void {
    this.props.provider_invoice_id = provider_id;
    this.touch();
  }

  private recalculate_amount(): void {
    this.props.amount = this.calculate_total();
  }

  private validate_line_items(): void {
    this.props.line_items.forEach((item) => this.validate_line_item(item));
  }

  private validate_line_item(item: InvoiceLineItem): void {
    if (!item.description || item.description.trim().length === 0) {
      throw new InvoiceInvalidStatusError('Line item description cannot be empty');
    }

    if (item.amount < 0) {
      throw new InvoiceInvalidStatusError('Line item amount cannot be negative');
    }

    if (item.quantity <= 0) {
      throw new InvoiceInvalidStatusError('Line item quantity must be positive');
    }
  }
}
