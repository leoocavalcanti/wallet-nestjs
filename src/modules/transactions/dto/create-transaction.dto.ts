import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'Receiver user ID for the transfer',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'Receiver ID must be a valid UUID' })
  receiverId: string;

  @ApiProperty({
    description: 'Transfer amount in cents (e.g., 5000 = $50.00)',
    example: 5000,
    minimum: 1
  })
  @IsInt({ message: 'Amount must be an integer number' })
  @Min(1, { message: 'Amount must be greater than zero (minimum 1 cent)' })
  amountInCents: number;

  @ApiPropertyOptional({
    description: 'Optional transfer description',
    example: 'Payment for services',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;
}