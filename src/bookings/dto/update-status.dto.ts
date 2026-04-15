import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({ enum: BookingStatus, example: BookingStatus.APPROVED })
  @IsEnum(BookingStatus)
  status: BookingStatus;
}