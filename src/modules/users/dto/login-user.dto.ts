import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    description: 'User email for login',
    example: 'user@example.com',
    format: 'email'
  })
  @IsEmail({}, { message: 'Email must be a valid format' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'mypassword123'
  })
  @IsString({ message: 'Password is required' })
  password: string;
}