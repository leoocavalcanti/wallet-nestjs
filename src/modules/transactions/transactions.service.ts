import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { Transaction } from './transaction.entity';
import { TransactionDomainService } from './services/transaction-domain.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,
    private transactionDomainService: TransactionDomainService,
  ) {}

  async create(senderId: string, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    return this.transactionDomainService.createTransfer(senderId, createTransactionDto);
  }

  async findById(id: string): Promise<any> {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.sender', 'sender')
      .leftJoin('transaction.receiver', 'receiver')
      .select([
        'transaction.id as id',
        'transaction.senderId as senderId', 
        'transaction.receiverId as receiverId',
        'transaction.amountInCents as amountInCents',
        'transaction.description as description',
        'transaction.status as status',
        'transaction.reversalReason as reversalReason',
        'transaction.createdAt as createdAt',
        'transaction.updatedAt as updatedAt',
        'sender.id as sender_id',
        'sender.email as sender_email', 
        'sender.name as sender_name',
        'receiver.id as receiver_id',
        'receiver.email as receiver_email',
        'receiver.name as receiver_name'
      ])
      .where('transaction.id = :id', { id })
      .getRawOne();

    if (!result) {
      throw new Error('Transaction not found');
    }

    return {
      id: result.id,
      senderId: result.senderId,
      receiverId: result.receiverId,
      amountInCents: result.amountInCents,
      description: result.description,
      status: result.status,
      reversalReason: result.reversalReason,
      createdAt: result.createdAt,
      updatedAt: result.updatedAt,
      sender: {
        id: result.sender_id,
        email: result.sender_email,
        name: result.sender_name
      },
      receiver: {
        id: result.receiver_id,
        email: result.receiver_email,
        name: result.receiver_name
      }
    };
  }

  async findByUserId(userId: string): Promise<any[]> {
    const result = await this.transactionsRepository
      .createQueryBuilder('transaction')
      .leftJoin('transaction.sender', 'sender')
      .leftJoin('transaction.receiver', 'receiver')
      .select([
        'transaction.id as id',
        'transaction.senderId as senderId', 
        'transaction.receiverId as receiverId',
        'transaction.amountInCents as amountInCents',
        'transaction.description as description',
        'transaction.status as status',
        'transaction.reversalReason as reversalReason',
        'transaction.createdAt as createdAt',
        'transaction.updatedAt as updatedAt',
        'sender.id as sender_id',
        'sender.email as sender_email', 
        'sender.name as sender_name',
        'receiver.id as receiver_id',
        'receiver.email as receiver_email',
        'receiver.name as receiver_name'
      ])
      .where('transaction.senderId = :userId OR transaction.receiverId = :userId', { userId })
      .orderBy('transaction.createdAt', 'DESC')
      .getRawMany();

    return result.map(row => ({
      id: row.id,
      senderId: row.senderId,
      receiverId: row.receiverId,
      amountInCents: row.amountInCents,
      description: row.description,
      status: row.status,
      reversalReason: row.reversalReason,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      sender: {
        id: row.sender_id,
        email: row.sender_email,
        name: row.sender_name
      },
      receiver: {
        id: row.receiver_id,
        email: row.receiver_email,
        name: row.receiver_name
      }
    }));
  }

  async reverse(transactionId: string, userId: string, reverseDto: ReverseTransactionDto): Promise<Transaction> {
    return this.transactionDomainService.reverseTransaction(transactionId, userId, reverseDto);
  }
}