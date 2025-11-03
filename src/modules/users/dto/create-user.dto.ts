import { IsEmail, IsString, MinLength, IsOptional, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Email must be a valid format' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'mypassword123',
    minLength: 6
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(6, { message: 'Password must have at least 6 characters' })
  password: string;

  @ApiProperty({
    description: 'User full name',
    example: 'John Doe',
    minLength: 2
  })
  @IsString({ message: 'Name must be a string' })
  @MinLength(2, { message: 'Name must have at least 2 characters' })
  name: string;

  @ApiProperty({
    description: 'Initial balance in cents (e.g., 10000 = $100.00)',
    example: 100000,
    minimum: 0,
    required: false,
    default: 0
  })
  @IsOptional()
  @IsInt({ message: 'Balance must be an integer number' })
  @Min(0, { message: 'Balance cannot be negative' })
  balanceInCents?: number = 0;
}