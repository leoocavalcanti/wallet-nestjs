import { Injectable, Logger } from '@nestjs/common';
import { IQueueService, ITransactionEventPublisher } from '../../common/interfaces/queue.interface';

@Injectable()
export class RabbitMQService implements IQueueService, ITransactionEventPublisher {
  private readonly logger = new Logger(RabbitMQService.name);

  async publishMessage<T>(queue: string, message: T): Promise<void> {
    this.logger.log(`[QUEUE] ${queue}:`, JSON.stringify(message, null, 2));
  }

  async consumeMessages<T>(queue: string, handler: (message: T) => Promise<void>): Promise<void> {
    this.logger.log(`[QUEUE] Consumer registered for queue: ${queue}`);
  }

  async publishTransactionCreated(transactionId: string, data: any): Promise<void> {
    await this.publishMessage('transaction.created', {
      transactionId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async publishTransactionCompleted(transactionId: string, data: any): Promise<void> {
    await this.publishMessage('transaction.completed', {
      transactionId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async publishTransactionReversed(transactionId: string, data: any): Promise<void> {
    await this.publishMessage('transaction.reversed', {
      transactionId,
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  async publishTransactionFailed(transactionId: string, error: string): Promise<void> {
    await this.publishMessage('transaction.failed', {
      transactionId,
      timestamp: new Date().toISOString(),
      error,
    });
  }
}