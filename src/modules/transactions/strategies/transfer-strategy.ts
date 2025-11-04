import { Injectable, BadRequestException } from '@nestjs/common';
import { ITransactionStrategy } from './transaction-strategy.interface';
import { User } from '../../users/user.entity';
import { Money } from '../../../common/value-objects/money.vo';

@Injectable()
export class TransferStrategy implements ITransactionStrategy {
  async validate(sender: User, receiver: User, amount: Money): Promise<void> {
    if (sender.id === receiver.id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }

    if (!sender || !receiver) {
      throw new BadRequestException('Invalid sender or receiver');
    }

    const senderBalance = Money.fromCents(sender.balanceInCents);
    if (senderBalance.isLessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  async execute(sender: User, receiver: User, amount: Money, description: string): Promise<void> {
    await this.validate(sender, receiver, amount);
    
    // Update balances
    sender.balanceInCents -= amount.amountInCents;
    receiver.balanceInCents += amount.amountInCents;
  }
}