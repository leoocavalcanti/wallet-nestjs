import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description: 'ID do usuário destinatário da transferência',
    example: '123e4567-e89b-12d3-a456-426614174001',
    format: 'uuid'
  })
  @IsUUID(4, { message: 'ID do destinatário deve ser um UUID válido' })
  receiverId: string;

  @ApiProperty({
    description: 'Valor da transferência em centavos (ex: 5000 = R$ 50,00)',
    example: 5000,
    minimum: 1
  })
  @IsInt({ message: 'Valor deve ser um número inteiro' })
  @Min(1, { message: 'Valor deve ser maior que zero (mínimo 1 centavo)' })
  amountInCents: number;

  @ApiPropertyOptional({
    description: 'Descrição opcional da transferência',
    example: 'Transferência PIX',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Descrição deve ser uma string' })
  description?: string;
}