import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Money } from '../../../common/value-objects/money.vo';
import { RabbitMQService } from '../../queue/rabbitmq.service';
import { User } from '../../users/user.entity';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { ReverseTransactionDto } from '../dto/reverse-transaction.dto';
import { TransactionStrategyFactory } from '../factories/transaction-strategy.factory';
import { TransactionType } from '../strategies/transaction-strategy.interface';
import { Transaction, TransactionStatus } from '../transaction.entity';

@Injectable()
export class TransactionDomainService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private dataSource: DataSource,
    private transactionStrategyFactory: TransactionStrategyFactory,
    private rabbitMQService: RabbitMQService,
  ) {}

  async createTransfer(senderId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const { receiverId, amountInCents, description } = createTransactionDto;
    const amount = Money.fromCents(amountInCents);

    return this.dataSource.transaction(async manager => {
      try {
        const strategy = this.transactionStrategyFactory.createStrategy(TransactionType.TRANSFER);

        const userIds = [senderId, receiverId].sort();
        const users = await manager.find(User, { 
          where: userIds.map(id => ({ id })),
          order: { id: 'ASC' },
          lock: { mode: 'pessimistic_write' }
        });

        if (users.length !== 2) {
          throw new BadRequestException('One or both users not found');
        }

        const sender = users.find(u => u.id === senderId);
        const receiver = users.find(u => u.id === receiverId);

        if (!sender || !receiver) {
          throw new BadRequestException('User not found');
        }

        const transaction = manager.create(Transaction, {
          senderId,
          receiverId,
          amountInCents,
          description,
          status: TransactionStatus.PENDING,
        });

        const savedTransaction = await manager.save(transaction);

        await this.rabbitMQService.publishTransactionCreated(savedTransaction.id, {
          senderId,
          receiverId,
          amountInCents,
          description,
        });

        await strategy.execute(sender, receiver, amount, description);

        await manager.save([sender, receiver]);

        savedTransaction.status = TransactionStatus.COMPLETED;
        const completedTransaction = await manager.save(savedTransaction);

        await this.rabbitMQService.publishTransactionCompleted(completedTransaction.id, {
          senderId,
          receiverId,
          amountInCents,
          description,
          newSenderBalance: sender.balanceInCents,
          newReceiverBalance: receiver.balanceInCents,
        });

        return completedTransaction;

      } catch (error) {
        await this.rabbitMQService.publishTransactionFailed('unknown', error.message);
        throw error;
      }
    });
  }

  async reverseTransaction(transactionId: string, userId: string, reverseDto: ReverseTransactionDto): Promise<Transaction> {
    const transaction = await this.findTransactionEntity(transactionId);

    this.validateTransactionForReversal(transaction, userId);

    return this.dataSource.transaction(async manager => {
      try {
        const userIds = [transaction.senderId, transaction.receiverId].sort();
        const users = await manager.find(User, { 
          where: userIds.map(id => ({ id })),
          order: { id: 'ASC' },
          lock: { mode: 'pessimistic_write' }
        });

        if (users.length !== 2) {
          throw new BadRequestException('User not found');
        }

        const sender = users.find(u => u.id === transaction.senderId);
        const receiver = users.find(u => u.id === transaction.receiverId);

        if (!sender || !receiver) {
          throw new BadRequestException('User not found');
        }

        // Reverse balances
        const amount = Money.fromCents(transaction.amountInCents);
        sender.balanceInCents += amount.amountInCents;
        receiver.balanceInCents -= amount.amountInCents;

        // Check if receiver has sufficient balance for reversal
        if (receiver.balanceInCents < 0) {
          throw new BadRequestException('Receiver has insufficient balance for reversal');
        }

        await manager.save([sender, receiver]);

        // Update transaction status
        transaction.status = TransactionStatus.REVERSED;
        transaction.reversalReason = reverseDto.reason || 'Requested by user';

        const reversedTransaction = await manager.save(transaction);

        // Publish transaction reversed event
        await this.rabbitMQService.publishTransactionReversed(transaction.id, {
          senderId: transaction.senderId,
          receiverId: transaction.receiverId,
          amountInCents: transaction.amountInCents,
          reason: reverseDto.reason,
          newSenderBalance: sender.balanceInCents,
          newReceiverBalance: receiver.balanceInCents,
        });

        return reversedTransaction;

      } catch (error) {
        await this.rabbitMQService.publishTransactionFailed(transactionId, error.message);
        throw error;
      }
    });
  }

  private async findTransactionEntity(transactionId: string): Promise<Transaction> {
    const transaction = await this.transactionsRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  private validateTransactionForReversal(transaction: Transaction, userId: string): void {
    if (transaction.senderId !== userId && transaction.receiverId !== userId) {
      throw new BadRequestException('You can only reverse your own transactions');
    }

    if (transaction.status !== TransactionStatus.COMPLETED) {
      throw new BadRequestException('Only completed transactions can be reversed');
    }
  }
}