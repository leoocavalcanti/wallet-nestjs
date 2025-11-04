import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { User } from '../users/user.entity';
import { TransactionDomainService } from './services/transaction-domain.service';
import { TransferStrategy } from './strategies/transfer-strategy';
import { TransactionStrategyFactory } from './factories/transaction-strategy.factory';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, User]),
    QueueModule,
  ],
  providers: [
    TransactionsService,
    TransactionDomainService,
    TransferStrategy,
    TransactionStrategyFactory,
  ],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}