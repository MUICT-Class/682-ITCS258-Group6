import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SearchRoomsDto } from './dto/search-rooms.dto';
import { BookingStatus, RoomStatus } from '@prisma/client';

@Injectable()
export class SearchService {
  constructor(private prisma: PrismaService) {}

  // Fr27-29
  async searchRooms(dto: SearchRoomsDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    return this.prisma.room.findMany({
      where: {
        status: RoomStatus.ACTIVE,
        // Fr28 filter by capacity
        ...(dto.capacity ? { capacity: {
            gte: dto.capacity
        }
    } : {}),
        
        NOT: {
          bookings: {
            some: {
              status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED, BookingStatus.PAID] },
              AND: [{checkIn:{ lt: checkOut }},
                { checkOut:{ gt: checkIn }},
              ],
            },
          },
        },
      },
      include: { images: true },
    });
  }
}