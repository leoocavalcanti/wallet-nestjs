import { Injectable } from '@nestjs/common';
import { ITransactionStrategy, TransactionType } from '../strategies/transaction-strategy.interface';
import { TransferStrategy } from '../strategies/transfer-strategy';

@Injectable()
export class TransactionStrategyFactory {
  constructor(
    private readonly transferStrategy: TransferStrategy,
  ) {}

  createStrategy(type: TransactionType): ITransactionStrategy {
    switch (type) {
      case TransactionType.TRANSFER:
        return this.transferStrategy;
      case TransactionType.DEPOSIT:
        throw new Error('Deposit strategy not implemented yet');
      case TransactionType.WITHDRAWAL:
        throw new Error('Withdrawal strategy not implemented yet');
      default:
        throw new Error(`Unknown transaction type: ${type}`);
    }
  }
}