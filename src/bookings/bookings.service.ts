import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { BookingStatus, Role } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private prisma: PrismaService) {}

  // Fr17-20, Fr22
  async create(userId: number, dto: CreateBookingDto) {
    const checkIn = new Date(dto.checkIn);
    const checkOut = new Date(dto.checkOut);

    // Fr19 validate dates
    if (checkIn >= checkOut) {
      throw new BadRequestException('Check-out must be after check-in');
    }

    const room = await this.prisma.room.findUnique({ where: { id: dto.roomId } });
    if (!room) throw new NotFoundException('Room not found');

    // Fr20 prevent double booking
    const conflict = await this.prisma.booking.findFirst({
      where: {
        roomId: dto.roomId,
        status: { in: [BookingStatus.PENDING, BookingStatus.APPROVED, BookingStatus.PAID] },
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
        ],
      },
    });
    if (conflict) throw new BadRequestException('Room is not available for selected dates');
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000*60*60*24));
    const totalPrice = Number(room.pricePerNight) * nights;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        roomId: dto.roomId,
        checkIn,
        checkOut,
        totalPrice,
        // Fr22 default status pending
        status: BookingStatus.PENDING,
      },
      include: { room: { include: { images: true } } },
    });

    // Fr30 create notification
    await this.prisma.notification.create({
      data: {
        userId,
        bookingId: booking.id,
        message: `Booking created for ${room.name} from ${dto.checkIn} to ${dto.checkOut}`,
      },
    });

    return booking;
  }

  // Fr23: user see all bookings
  async findMyBookings(userId: number) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { room: { include: { images: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Fr24 user get booking detail
  async findOne(id: number, userId: number, role: Role) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { room: { include: { images: true } } },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (role !== Role.ADMIN && booking.userId !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return booking;
  }

  // Fr25 admin get all bookings
  async findAll() {
    return this.prisma.booking.findMany({
      include: {
        room: { include: { images: true } },
        user: { select: { id: true, email: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // F26 update booking status
  async updateStatus(id: number, dto: UpdateStatusDto) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');

    // Fr31
    if (dto.status === BookingStatus.CANCELLED) {
      await this.prisma.notification.create({
        data: {
          userId: booking.userId,
          bookingId: booking.id,
          message: `Booking #${booking.id} has been cancelled`,
        },
      });
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
    });
  }

  // cancel booking
  async cancel(id: number, userId: number) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException('Booking not found');
    if (booking.userId !== userId) throw new ForbiddenException('Access denied');
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking already cancelled');
    }

    // Fr31 notification
    await this.prisma.notification.create({
      data: {
        userId,
        bookingId: booking.id,
        message: `Booking #${booking.id} has been cancelled`,
      },
    });

    return this.prisma.booking.update({
      where: { id },
      data: { status: BookingStatus.CANCELLED },
    });
  }
}
