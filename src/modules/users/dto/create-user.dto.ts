import { IsEmail, IsString, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  email: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'minhasenha123',
    minLength: 6
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  password: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    minLength: 2
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @MinLength(2, { message: 'Nome deve ter pelo menos 2 caracteres' })
  name: string;

  @ApiProperty({
    description: 'Saldo inicial em centavos (ex: 10000 = R$ 100,00)',
    example: 100000,
    minimum: 0,
    required: false,
    default: 0
  })
  @IsOptional()
  @IsInt({ message: 'Saldo deve ser um número inteiro' })
  @Min(0, { message: 'Saldo não pode ser negativo' })
  balanceInCents?: number = 0;
}