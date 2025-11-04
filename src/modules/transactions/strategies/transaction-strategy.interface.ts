import { User } from '../../users/user.entity';
import { Money } from '../../../common/value-objects/money.vo';

export interface ITransactionStrategy {
  execute(sender: User, receiver: User, amount: Money, description: string): Promise<void>;
  validate(sender: User, receiver: User, amount: Money): Promise<void>;
}

export enum TransactionType {
  TRANSFER = 'transfer',
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal'
}