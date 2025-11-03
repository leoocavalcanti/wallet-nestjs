import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ReverseTransactionDto {
  @ApiPropertyOptional({
    description: 'Motivo da reversão da transação',
    example: 'Solicitação do usuário',
    required: false
  })
  @IsOptional()
  @IsString({ message: 'Motivo da reversão deve ser uma string' })
  reason?: string;
}