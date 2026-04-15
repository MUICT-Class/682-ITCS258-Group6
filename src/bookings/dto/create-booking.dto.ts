import { IsInt, IsDateString, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  roomId: number;

  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2026-05-05' })
  @IsDateString()
  checkOut: string;

}