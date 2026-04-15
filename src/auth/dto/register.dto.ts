import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'group6@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password1234' })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ example: 'Grace' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Delrey' })
  @IsString()
  lastName: string;

}