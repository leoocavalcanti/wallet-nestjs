# 🏦 Financial Wallet System

Monolithic financial wallet system built with **NestJS**, **TypeScript**, **PostgreSQL**, and **JWT** for secure transfers between users.

## 📋 Table of Contents

- [🎯 Objective](#-objective)
- [🏗️ Architecture](#️-architecture)
- [✅ Requirements Met](#-requirements-met)
- [🚀 Installation and Configuration](#-installation-and-configuration)
- [▶️ How to Start](#️-how-to-start)
- [📡 API Endpoints](#-api-endpoints)
- [🧪 Tests](#-tests)
- [🔒 Security](#-security)
- [📊 Data Architecture](#-data-architecture)

## 🎯 Objective

Financial wallet system that allows users to:

- **Securely register and authenticate** users
- **Transfer balances** between users with validation
- **Reversible transactions** for any inconsistencies
- **Balance in cents** to preserve decimal precision
- **Complete logs and monitoring** of operations

## 🏗️ Architecture

### Clean Code Architecture with Design Patterns

The system implements **Clean Code**, **SOLID principles**, and **Design Patterns** for maximum quality and maintainability.

```mermaid
graph TD
    A[Client] -->|HTTP :3000| B[NestJS Application]
    B --> C[Auth Module]
    B --> D[Users Module] 
    B --> E[Transactions Module]
    B --> R[Queue Module]
    
    C --> F[JWT Strategy]
    D --> G[Users Service]
    E --> H[Transactions Service]
    E --> T[Transaction Domain Service]
    E --> S[Strategy Factory]
    E --> ST[Transfer Strategy]
    
    T --> SF[Strategy Factory]
    T --> RQ[RabbitMQ Service]
    SF --> ST
    
    G --> I[PostgreSQL Database]
    H --> I
    T --> I
    RQ --> Q[RabbitMQ Logs]
    
    I --> J[Users Table]
    I --> K[Transactions Table]
    
    B --> L[Winston Logger]
    B --> M[Swagger Documentation]
    
    classDef pattern fill:#e1f5fe
    class S,SF,ST,T pattern
```

### Clean Code Architecture

#### 📂 Folder Structure
```
src/
├── common/
│   ├── interfaces/           # Interfaces for SOLID
│   │   ├── repository.interface.ts
│   │   └── queue.interface.ts
│   └── value-objects/        # Value Objects (DDD)
│       └── money.vo.ts
├── modules/
│   ├── auth/                 # Authentication
│   ├── users/                # User management
│   ├── transactions/
│   │   ├── services/         # Domain Services
│   │   │   └── transaction-domain.service.ts
│   │   ├── strategies/       # Strategy Pattern
│   │   │   ├── transaction-strategy.interface.ts
│   │   │   └── transfer-strategy.ts
│   │   ├── factories/        # Factory Pattern
│   │   │   └── transaction-strategy.factory.ts
│   │   └── dto/              # Data Transfer Objects
│   └── queue/                # RabbitMQ Integration
│       └── rabbitmq.service.ts
```

### 🎯 Implemented Design Patterns

| Pattern | Implementation | Benefit |
|---------|---------------|-----------|
| **Strategy Pattern** | `TransferStrategy` for transaction types | Extensibility for new types |
| **Factory Pattern** | `TransactionStrategyFactory` | Centralized strategy creation |
| **Domain Service** | `TransactionDomainService` | Isolated business logic |
| **Value Objects** | `Money` class | Monetary value encapsulation |
| **Repository Pattern** | Generic interfaces | Data access abstraction |

### 🔧 SOLID Principles

- ✅ **Single Responsibility**: Each class has a single responsibility
- ✅ **Open/Closed**: Strategy Pattern allows extension without modification
- ✅ **Liskov Substitution**: Interfaces allow implementation substitution
- ✅ **Interface Segregation**: Specific interfaces (IQueueService, ITransactionEventPublisher)
- ✅ **Dependency Inversion**: Dependency injection and abstractions

### 🐰 RabbitMQ Integration

Asynchronous event system for transaction monitoring:

```typescript
// Automatically published events:
transaction.created     // When transaction is created
transaction.completed   // When transaction is completed
transaction.reversed    // When transaction is reversed
transaction.failed      // When transaction fails
```

### Components

| Component | Description |
|-----------|-------------|
| **NestJS Application** | Main application on port 3000 |
| **Auth Module** | JWT authentication with strategies |
| **Users Module** | User and balance management |
| **Transactions Module** | Processing with Clean Architecture |
| **Transaction Domain Service** | Complex business logic |
| **Strategy Factory** | Transaction strategy creation |
| **RabbitMQ Service** | Asynchronous events and logging |
| **PostgreSQL** | Main database |
| **Winston Logger** | Structured logging system |
| **Swagger** | Automatic API documentation |

## ✅ Requirements Met

### Mandatory Requirements ✅

- ✅ **User registration** - Endpoint `/auth/register`
- ✅ **JWT Authentication** - Endpoint `/auth/login`
- ✅ **Transfers** - Endpoint `POST /transactions`
- ✅ **Balance validation** - Verification before each transfer
- ✅ **Reversible transactions** - Endpoint `PATCH /transactions/:id/reverse`

### Mandatory Technologies ✅

- ✅ **Node.js** - JavaScript runtime
- ✅ **NestJS** - Framework for scalable applications
- ✅ **TypeScript** - Programming language

### Implemented Differentiators ✅

- ✅ **Docker** - Complete containerization
- ✅ **Unit tests** - 27 passing tests
- ✅ **Integration tests** - Complete E2E tests
- ✅ **Documentation** - Swagger + detailed README
- ✅ **Logging** - Winston for structured logs
- ✅ **Clean Code** - Clean and SOLID architecture
- ✅ **Design Patterns** - Strategy, Factory, Domain Service
- ✅ **RabbitMQ** - Asynchronous event system
- ✅ **Value Objects** - Money class for precision
- ✅ **Security** - Sensitive data sanitization

## 🚀 Installation and Configuration

### Prerequisites

- **Node.js** 18+ and **npm**
- **Docker** and **Docker Compose**
- **Git**
- **Postman** or **curl** (for API testing)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd microsservices-bank
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

The `.env` file is already configured with default values:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/financial_wallet
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

⚠️ **IMPORTANT**: In production, change the `JWT_SECRET` to a secure key!

## ▶️ How to Start

### 1. Start the Database

```bash
# PostgreSQL only
docker-compose up postgres -d
```

### 2. Run the Application

```bash
# Development
npm run start:dev

# Production (build first)
npm run build
npm run start:prod
```

### 3. Check the Logs

You should see logs similar to:

```
🚀 Financial Wallet API is running on port 3000
📖 API Documentation available at http://localhost:3000/api
```

### 4. Access Documentation

- **Swagger API**: http://localhost:3000/api
- **Application**: http://localhost:3000

## 🐳 Run with Docker

### Start entire environment

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Application on port 3000

## 📡 API Endpoints

Base URL: `http://localhost:3000`

### 🔐 Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@email.com",
  "password": "password123",
  "name": "User Name",
  "balanceInCents": 100000
}
```

**Response (201):**
```json
{
  "user": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "user@email.com",
    "name": "User Name",
    "balanceInCents": 100000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@email.com",
  "password": "password123"
}
```

### 👤 Users (Authenticated)

#### User Profile
```http
GET /users/profile
Authorization: Bearer <token>
```

#### User Balance
```http
GET /users/balance
Authorization: Bearer <token>
```

**Response:**
```json
{
  "balanceInCents": 100000,
  "balanceInReais": 1000.00
}
```

### 💸 Transactions (Authenticated)

#### Create Transfer
```http
POST /transactions
Authorization: Bearer <token>
Content-Type: application/json

{
  "receiverId": "receiver-uuid",
  "amountInCents": 5000,
  "description": "PIX Transfer"
}
```

**Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "senderId": "123e4567-e89b-12d3-a456-426614174000",
  "receiverId": "123e4567-e89b-12d3-a456-426614174001",
  "amountInCents": 5000,
  "description": "PIX Transfer",
  "status": "completed",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### List User Transactions
```http
GET /transactions
Authorization: Bearer <token>
```

#### Get Transaction by ID
```http
GET /transactions/{id}
Authorization: Bearer <token>
```

#### Reverse Transaction
```http
PATCH /transactions/{id}/reverse
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Reversal reason"
}
```

## 🧪 Tests

The project includes complete unit and integration test coverage.

### Run Tests

```bash
# All tests
npm test

# Unit tests only
npm run test:unit

# Integration tests (E2E)
npm run test:e2e

# Tests with coverage
npm run test:cov

# Watch mode (development)
npm run test:watch
```

### Test Coverage

#### Unit Tests
- ✅ **AuthService** - Registration, login, JWT validation
- ✅ **UsersService** - User CRUD, balance validation
- ✅ **TransactionsService** - Transfers, reversals

#### Integration Tests (E2E)
- ✅ **Authentication** - Complete registration and login
- ✅ **Users** - Profile and balance queries
- ✅ **Transactions** - Creation, listing, search, reversal
- ✅ **Security** - JWT token validation
- ✅ **Validations** - Input data and business rules

## 🔒 Security

### Security Implementations

- ✅ **JWT Authentication** - Secure tokens with expiration
- ✅ **Password Hashing** - bcryptjs with salt rounds
- ✅ **Input Validation** - class-validator in all DTOs
- ✅ **SQL Injection Protection** - TypeORM with prepared statements
- ✅ **CORS** - Configured for allowed origins
- ✅ **Rate Limiting** - Via reverse proxy (recommended)

### Best Practices

- Passwords hashed with bcrypt (salt rounds: 10)
- JWT tokens with 24h expiration
- Strict input validation
- Atomic transactions for financial operations
- Structured logs without sensitive information

## 🧹 Clean Code & Architecture

### Applied Principles

#### 🎯 Clean Code
- **Descriptive names**: Classes and methods with clear names
- **Small functions**: One responsibility per function
- **Unnecessary comments removed**: Self-explanatory code
- **Error handling**: Specific exceptions for each case
- **Comprehensive tests**: 100% coverage of critical cases

#### 🏗️ Clean Architecture
```
┌─────────────────────────────────────┐
│           Controllers               │ ← Interface/Framework Layer
├─────────────────────────────────────┤
│              Services               │ ← Application Layer
├─────────────────────────────────────┤
│          Domain Services            │ ← Domain Layer
│         Value Objects               │
│           Strategies                │
├─────────────────────────────────────┤
│            Repository               │ ← Infrastructure Layer
│            Database                 │
│            RabbitMQ                 │
└─────────────────────────────────────┘
```

#### 💎 Implemented Value Objects
```typescript
// Money Value Object - Encapsulates monetary logic
export class Money {
  private readonly _amountInCents: number;
  
  constructor(amountInCents: number) {
    if (!Number.isInteger(amountInCents)) {
      throw new Error('Amount must be an integer representing cents');
    }
    this._amountInCents = amountInCents;
  }
  
  add(other: Money): Money {
    return new Money(this._amountInCents + other._amountInCents);
  }
  
  subtract(other: Money): Money {
    const result = this._amountInCents - other._amountInCents;
    if (result < 0) throw new Error('Insufficient funds');
    return new Money(result);
  }
}
```

#### 🎨 Strategy Pattern Example
```typescript
// Interface for transaction strategies
export interface ITransactionStrategy {
  validate(sender: User, receiver: User, amount: Money): Promise<void>;
  execute(sender: User, receiver: User, amount: Money, description: string): Promise<void>;
}

// Specific implementation for transfers
@Injectable()
export class TransferStrategy implements ITransactionStrategy {
  async validate(sender: User, receiver: User, amount: Money): Promise<void> {
    if (sender.id === receiver.id) {
      throw new BadRequestException('Cannot transfer to yourself');
    }
    
    const senderBalance = Money.fromCents(sender.balanceInCents);
    if (senderBalance.isLessThan(amount)) {
      throw new BadRequestException('Insufficient balance');
    }
  }

  async execute(sender: User, receiver: User, amount: Money): Promise<void> {
    await this.validate(sender, receiver, amount);
    sender.balanceInCents -= amount.amountInCents;
    receiver.balanceInCents += amount.amountInCents;
  }
}
```

### 🔄 Event-Driven Architecture

#### RabbitMQ Events
```typescript
// Transaction system events
interface TransactionEvents {
  'transaction.created': {
    transactionId: string;
    senderId: string;
    receiverId: string;
    amountInCents: number;
    timestamp: string;
  };
  
  'transaction.completed': {
    transactionId: string;
    newSenderBalance: number;
    newReceiverBalance: number;
    timestamp: string;
  };
  
  'transaction.reversed': {
    transactionId: string;
    reason: string;
    timestamp: string;
  };
}
```

### 📊 Metrics & Observability
- **Structured Logging**: Winston with JSON format
- **Transaction Events**: RabbitMQ for auditing
- **Error Tracking**: Structured stack traces
- **Performance**: Database transaction timing
- **Security**: Automatic sensitive data sanitization

## 📊 Data Architecture

### Data Model

```mermaid
erDiagram
    User {
        uuid id PK
        string email UK
        string password
        string name
        integer balanceInCents
        timestamp createdAt
        timestamp updatedAt
    }
    
    Transaction {
        uuid id PK
        uuid senderId FK
        uuid receiverId FK
        integer amountInCents
        string description
        enum status
        string reversalReason
        timestamp createdAt
        timestamp updatedAt
    }
    
    User ||--o{ Transaction : "sends"
    User ||--o{ Transaction : "receives"
```

### Entities

#### User
- `id`: Unique user UUID
- `email`: Unique email for login
- `password`: bcrypt hashed password
- `name`: User's full name
- `balanceInCents`: Balance in cents (integer)

#### Transaction
- `id`: Unique transaction UUID
- `senderId`: Sender user UUID
- `receiverId`: Receiver user UUID
- `amountInCents`: Amount in cents (integer)
- `status`: pending | completed | reversed | failed
- `description`: Optional description
- `reversalReason`: Reversal reason (if applicable)

### Business Rules

1. **Balance in Cents**: All values stored as integers in cents
2. **Atomic Transactions**: Transfers use database transactions
3. **Balance Validation**: Mandatory verification before transfers
4. **Reversals**: Only "completed" transactions can be reversed
5. **Security**: Users can only reverse their own transactions

## 🔄 Complete Test Flow

### 1. Register Users
```bash
# First user
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@email.com",
    "password": "password123",
    "name": "User 1",
    "balanceInCents": 100000
  }'

# Second user  
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user2@email.com",
    "password": "password123", 
    "name": "User 2",
    "balanceInCents": 50000
  }'
```

### 2. Login and Get Token
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@email.com",
    "password": "password123"
  }'
```

### 3. Create Transfer
```bash
curl -X POST http://localhost:3000/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER1_TOKEN>" \
  -d '{
    "receiverId": "<USER2_ID>",
    "amountInCents": 25000,
    "description": "Test transfer"
  }'
```

### 4. Check Balances
```bash
# Sender balance
curl -H "Authorization: Bearer <USER1_TOKEN>" \
  http://localhost:3000/users/balance

# Receiver balance (requires user2 token)
curl -H "Authorization: Bearer <USER2_TOKEN>" \
  http://localhost:3000/users/balance
```

### 5. Reverse Transaction (Optional)
```bash
curl -X PATCH http://localhost:3000/transactions/<TRANSACTION_ID>/reverse \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <USER1_TOKEN>" \
  -d '{
    "reason": "Test reversal"
  }'
```

## 🛠️ Troubleshooting

### Application doesn't start
- Check if Node.js 18+ is installed
- Run `npm install` to install dependencies
- Check if port 3000 is available

### Database connection error
- Run `docker-compose up postgres -d`
- Wait a few seconds for database initialization
- Check logs: `docker-compose logs postgres`

### Tests failing
- Make sure database is running
- Run `npm run test:unit` for tests that don't depend on database
- For E2E tests, database must be available

---

## 📚 Technologies Used

### Core Technologies
- **Node.js** - JavaScript runtime
- **NestJS** - Framework for scalable applications
- **TypeScript** - Typed programming language
- **PostgreSQL** - Relational database

### Architecture & Patterns
- **Clean Architecture** - Layered architecture
- **SOLID Principles** - Design principles
- **Strategy Pattern** - For transaction types
- **Factory Pattern** - Object creation
- **Domain Services** - Business logic
- **Value Objects** - Value encapsulation

### Security & Authentication
- **JWT** - Token-based authentication
- **bcryptjs** - Password hashing
- **Passport.js** - Authentication strategies

### Database & ORM
- **TypeORM** - ORM for TypeScript
- **PostgreSQL Driver** - Database connectivity

### Messaging & Events
- **RabbitMQ** - Asynchronous event system
- **amqplib** - RabbitMQ client for Node.js

### Development & Testing
- **Jest** - Testing framework
- **Supertest** - HTTP integration testing
- **Docker** - Containerization
- **Docker Compose** - Container orchestration

### Monitoring & Documentation
- **Winston** - Structured logging system
- **Swagger** - Automatic API documentation
- **class-validator** - Input validation
- **class-transformer** - Object transformation

---

- **🏗️ Layered Architecture**: Clear separation of responsibilities
- **🎯 Strategy Pattern**: Extensibility for new transaction types
- **🏭 Factory Pattern**: Centralized object creation
- **💰 Value Objects**: Money class for safe monetary operations
- **🐰 RabbitMQ Events**: Asynchronous event system for auditing
- **🔒 Enhanced Security**: Automatic sensitive data sanitization
- **✅ 27 Unit Tests**: Complete coverage with new architecture
