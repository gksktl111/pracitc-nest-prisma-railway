import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsService {
  constructor(private readonly prisma: PrismaService) {}

  // ✅ 전체 조회
  async findAllItems() {
    return this.prisma.item.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        owner: true, // User 정보 포함
      },
    });
  }

  // ✅ 단일 조회
  async findItemById(itemId: string) {
    const item = await this.prisma.item.findUnique({
      where: { id: itemId },
      include: {
        owner: true,
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found');
    }

    return item;
  }

  // --- 기존 코드 ---
  async createItem(dto: CreateItemDto) {
    return this.prisma.item.create({
      data: dto,
    });
  }

  async updateItem(itemId: string, dto: UpdateItemDto) {
    const exists = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!exists) {
      throw new NotFoundException('Item not found');
    }

    return this.prisma.item.update({
      where: { id: itemId },
      data: dto,
    });
  }

  async deleteItem(itemId: string) {
    const exists = await this.prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!exists) {
      throw new NotFoundException('Item not found');
    }

    return this.prisma.item.delete({
      where: { id: itemId },
    });
  }
}
