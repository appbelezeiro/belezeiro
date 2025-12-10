import { InvalidMoneyError, CurrencyMismatchError } from '@/domain/errors/money.errors';

export class Money {
  constructor(
    private readonly amount: number,
    private readonly currency: string,
  ) {
    if (amount < 0) {
      throw new InvalidMoneyError('Amount cannot be negative');
    }

    if (!currency || currency.trim().length === 0) {
      throw new InvalidMoneyError('Currency cannot be empty');
    }
  }

  get_amount(): number {
    return this.amount;
  }

  get_currency(): string {
    return this.currency;
  }

  to_string(): string {
    return `${this.currency} ${(this.amount / 100).toFixed(2)}`;
  }

  to_decimal(): number {
    return this.amount / 100;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(
        `Cannot add ${this.currency} with ${other.currency}`,
      );
    }
    return new Money(this.amount + other.amount, this.currency);
  }

  subtract(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError(
        `Cannot subtract ${this.currency} from ${other.currency}`,
      );
    }
    return new Money(this.amount - other.amount, this.currency);
  }

  multiply(factor: number): Money {
    if (factor < 0) {
      throw new InvalidMoneyError('Factor cannot be negative');
    }
    return new Money(Math.round(this.amount * factor), this.currency);
  }

  equals(other: Money): boolean {
    return this.amount === other.amount && this.currency === other.currency;
  }

  is_greater_than(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError('Cannot compare different currencies');
    }
    return this.amount > other.amount;
  }

  is_less_than(other: Money): boolean {
    if (this.currency !== other.currency) {
      throw new CurrencyMismatchError('Cannot compare different currencies');
    }
    return this.amount < other.amount;
  }

  static from_decimal(amount: number, currency: string): Money {
    return new Money(Math.round(amount * 100), currency);
  }

  static zero(currency: string): Money {
    return new Money(0, currency);
  }
}
