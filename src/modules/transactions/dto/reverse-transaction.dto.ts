import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReverseTransactionDto {
  @ApiPropertyOptional({
    description: 'Reason for transaction reversal',
    example: 'User request',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Reversal reason must be a string' })
  reason?: string;
}