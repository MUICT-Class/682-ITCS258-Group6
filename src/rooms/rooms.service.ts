import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomStatus } from '@prisma/client';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  // Fr12 find all rooms
  async findAll() {
    return this.prisma.room.findMany({
      where: { status: RoomStatus.ACTIVE },
      include: { images: true },
    });
  }

  // Fr13 find a room
  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({
      where: { id },
      include: { images: true },
    });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  // Fr8 create
  async create(dto: CreateRoomDto) {
    const { images, ...roomData } = dto;
    return this.prisma.room.create({
      data: {
        ...roomData,
        images: images ? { create: images } : undefined,
      },
      include: { images: true },
    });
  }

  // Fr9 update
  async update(id: number, dto: UpdateRoomDto) {
    await this.findOne(id);
    const { images, ...roomData } = dto;
    return this.prisma.room.update({
      where: { id },
      data: roomData,
      include: { images: true },
    });
  }

  // Fr10 deactivate
  async deactivate(id: number) {
    await this.findOne(id);
    return this.prisma.room.update({
      where: { id },
      data: { status: RoomStatus.DEACTIVATED },
    });
  }

  // Fr10 remove
  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.room.delete({ where: { id } });
  }
}