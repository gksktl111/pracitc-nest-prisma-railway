import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  createUser(dto: CreateUserDto) {
    return this.prisma.user.create({
      data: dto,
    });
  }

  findAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  findUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async updateUser(userId: string, dto: UpdateUserDto) {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!exists) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  async deleteUser(userId: string) {
    const exists = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!exists) {
      throw new NotFoundException('User not found');
    }
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
