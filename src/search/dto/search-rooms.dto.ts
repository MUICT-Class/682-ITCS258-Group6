import { IsDateString, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchRoomsDto {
  @ApiProperty({ example: '2026-05-01' })
  @IsDateString()
  checkIn: string;

  @ApiProperty({ example: '2026-05-05' })
  @IsDateString()
  checkOut: string;

  @ApiProperty({ example: 2, required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  capacity?: number;
}