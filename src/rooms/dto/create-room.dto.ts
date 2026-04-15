import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoomImageDto {
  @ApiProperty({ example: 'https://image.jpg' })
  @IsString()
  url: string;

  @ApiProperty({ example: 'Room view', required: false })
  @IsOptional()
  @IsString()
  altText?: string;
}

export class CreateRoomDto {
  @ApiProperty({ example: 'Deluxe Room' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Beautiful room', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 2 })
  @IsNumber()
  @Min(1)
  capacity: number;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  pricePerNight: number;

  @ApiProperty({ type: [CreateRoomImageDto], required: false })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRoomImageDto)
  images?: CreateRoomImageDto[];
}