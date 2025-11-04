export class Money {
  private readonly _amountInCents: number;

  constructor(amountInCents: number) {
    if (!Number.isInteger(amountInCents)) {
      throw new Error('Amount must be an integer representing cents');
    }
    if (amountInCents < 0) {
      throw new Error('Amount cannot be negative');
    }
    this._amountInCents = amountInCents;
  }

  static fromReais(amountInReais: number): Money {
    return new Money(Math.round(amountInReais * 100));
  }

  static fromCents(amountInCents: number): Money {
    return new Money(amountInCents);
  }

  get amountInCents(): number {
    return this._amountInCents;
  }

  get amountInReais(): number {
    return this._amountInCents / 100;
  }

  add(other: Money): Money {
    return new Money(this._amountInCents + other._amountInCents);
  }

  subtract(other: Money): Money {
    const result = this._amountInCents - other._amountInCents;
    if (result < 0) {
      throw new Error('Insufficient funds');
    }
    return new Money(result);
  }

  isGreaterThan(other: Money): boolean {
    return this._amountInCents > other._amountInCents;
  }

  isLessThan(other: Money): boolean {
    return this._amountInCents < other._amountInCents;
  }

  equals(other: Money): boolean {
    return this._amountInCents === other._amountInCents;
  }

  toString(): string {
    return `R$ ${this.amountInReais.toFixed(2)}`;
  }
}