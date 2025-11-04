export interface IQueueService {
  publishMessage<T>(queue: string, message: T): Promise<void>;
  consumeMessages<T>(queue: string, handler: (message: T) => Promise<void>): Promise<void>;
}

export interface ITransactionEventPublisher {
  publishTransactionCreated(transactionId: string, data: any): Promise<void>;
  publishTransactionCompleted(transactionId: string, data: any): Promise<void>;
  publishTransactionReversed(transactionId: string, data: any): Promise<void>;
  publishTransactionFailed(transactionId: string, error: string): Promise<void>;
}