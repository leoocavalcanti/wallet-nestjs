import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { ReverseTransactionDto } from './dto/reverse-transaction.dto';
import { TransactionDomainService } from './services/transaction-domain.service';
import { Transaction, TransactionStatus } from './transaction.entity';
import { TransactionsService } from './transactions.service';

describe('TransactionsService', () => {
  let service: TransactionsService;
  let repository: Repository<Transaction>;
  let domainService: TransactionDomainService;

  const mockTransaction: Transaction = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    senderId: '123e4567-e89b-12d3-a456-426614174000',
    receiverId: '123e4567-e89b-12d3-a456-426614174001',
    amountInCents: 5000,
    description: 'Test transfer',
    status: TransactionStatus.COMPLETED,
    reversalReason: null,
    sender: null,
    receiver: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockDomainService = {
    createTransfer: jest.fn(),
    reverseTransaction: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockRepository,
        },
        {
          provide: TransactionDomainService,
          useValue: mockDomainService,
        },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    repository = module.get<Repository<Transaction>>(getRepositoryToken(Transaction));
    domainService = module.get<TransactionDomainService>(TransactionDomainService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createTransactionDto: CreateTransactionDto = {
      receiverId: '123e4567-e89b-12d3-a456-426614174001',
      amountInCents: 5000,
      description: 'Test transfer',
    };

    it('should create a transaction successfully', async () => {
      const senderId = '123e4567-e89b-12d3-a456-426614174000';
      
      mockDomainService.createTransfer.mockResolvedValue(mockTransaction);

      const result = await service.create(senderId, createTransactionDto);

      expect(mockDomainService.createTransfer).toHaveBeenCalledWith(senderId, createTransactionDto);
      expect(result).toEqual(mockTransaction);
    });

    it('should delegate errors to domain service', async () => {
      const senderId = '123e4567-e89b-12d3-a456-426614174000';
      const error = new BadRequestException('Domain service error');
      
      mockDomainService.createTransfer.mockRejectedValue(error);

      await expect(service.create(senderId, createTransactionDto)).rejects.toThrow(error);
    });
  });

  describe('findById', () => {
    it('should return transaction if found', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          id: mockTransaction.id,
          senderId: mockTransaction.senderId,
          receiverId: mockTransaction.receiverId,
          amountInCents: mockTransaction.amountInCents,
          description: mockTransaction.description,
          status: mockTransaction.status,
          reversalReason: mockTransaction.reversalReason,
          createdAt: mockTransaction.createdAt,
          updatedAt: mockTransaction.updatedAt,
          sender_id: mockTransaction.senderId,
          sender_email: 'sender@test.com',
          sender_name: 'Sender Name',
          receiver_id: mockTransaction.receiverId,
          receiver_email: 'receiver@test.com',
          receiver_name: 'Receiver Name',
        }),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findById(mockTransaction.id);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('transaction');
      expect(result).toHaveProperty('id', mockTransaction.id);
      expect(result).toHaveProperty('sender');
      expect(result).toHaveProperty('receiver');
    });

    it('should throw error if transaction not found', async () => {
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue(null),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findById('nonexistent-id')).rejects.toThrow('Transaction not found');
    });
  });

  describe('findByUserId', () => {
    it('should return user transactions', async () => {
      const userId = '123e4567-e89b-12d3-a456-426614174000';
      const mockQueryBuilder = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValue([{
          id: mockTransaction.id,
          senderId: mockTransaction.senderId,
          receiverId: mockTransaction.receiverId,
          amountInCents: mockTransaction.amountInCents,
          description: mockTransaction.description,
          status: mockTransaction.status,
          reversalReason: mockTransaction.reversalReason,
          createdAt: mockTransaction.createdAt,
          updatedAt: mockTransaction.updatedAt,
          sender_id: mockTransaction.senderId,
          sender_email: 'sender@test.com',
          sender_name: 'Sender Name',
          receiver_id: mockTransaction.receiverId,
          receiver_email: 'receiver@test.com',
          receiver_name: 'Receiver Name',
        }]),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findByUserId(userId);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('transaction');
      expect(result).toHaveLength(1);
      expect(result[0]).toHaveProperty('id', mockTransaction.id);
      expect(result[0]).toHaveProperty('sender');
      expect(result[0]).toHaveProperty('receiver');
    });
  });

  describe('reverse', () => {
    const reverseDto: ReverseTransactionDto = {
      reason: 'User requested reversal',
    };

    it('should reverse transaction successfully', async () => {
      const userId = mockTransaction.senderId;
      const reversedTransaction = { ...mockTransaction, status: TransactionStatus.REVERSED };
      
      mockDomainService.reverseTransaction.mockResolvedValue(reversedTransaction);

      const result = await service.reverse(mockTransaction.id, userId, reverseDto);

      expect(mockDomainService.reverseTransaction).toHaveBeenCalledWith(mockTransaction.id, userId, reverseDto);
      expect(result).toEqual(reversedTransaction);
    });

    it('should delegate errors to domain service', async () => {
      const userId = mockTransaction.senderId;
      const error = new BadRequestException('Domain service error');
      
      mockDomainService.reverseTransaction.mockRejectedValue(error);

      await expect(service.reverse(mockTransaction.id, userId, reverseDto)).rejects.toThrow(error);
    });
  });
});