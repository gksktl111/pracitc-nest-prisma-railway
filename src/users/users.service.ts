import { Injectable } from '@nestjs/common';
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

  findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
    });
  }

  updateUser(userId: string, dto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
  }

  deleteUser(userId: string) {
    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
