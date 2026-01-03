import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;

  let prisma: {
    user: {
      create: jest.Mock;
      findMany: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get(UsersService);
    prisma = module.get(PrismaService);
  });

  describe('createUser', () => {
    it('사용자를 생성한다', async () => {
      const dto = { email: 'test@test.com', password: 'pw' };
      const createdUser = { id: '1', ...dto };

      prisma.user.create.mockResolvedValue(createdUser as any);

      const result = await service.createUser(dto);

      expect(prisma.user.create).toHaveBeenCalledWith({ data: dto });
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAllUsers', () => {
    it('사용자 목록을 최신순으로 조회한다', async () => {
      const users = [{ id: '1' }, { id: '2' }];

      prisma.user.findMany.mockResolvedValue(users as any);

      const result = await service.findAllUsers();

      expect(prisma.user.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(users);
    });
  });

  describe('findUserByEmail', () => {
    it('이메일로 사용자를 조회한다', async () => {
      const user = { id: '1', email: 'test@test.com' };

      prisma.user.findUnique.mockResolvedValue(user as any);

      const result = await service.findUserByEmail('test@test.com');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@test.com' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('findUserById', () => {
    it('ID로 사용자를 조회한다', async () => {
      const user = { id: '1', email: 'test@test.com' };

      prisma.user.findUnique.mockResolvedValue(user as any);

      const result = await service.findUserById('1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(user);
    });
  });

  describe('deleteUser', () => {
    it('존재하는 사용자를 삭제한다', async () => {
      const user = { id: '1', email: 'test@test.com' };

      prisma.user.findUnique.mockResolvedValue(user as any);
      prisma.user.delete.mockResolvedValue(user as any);

      const result = await service.deleteUser('1');

      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(prisma.user.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
      expect(result).toEqual(user);
    });

    it('존재하지 않는 사용자를 삭제하려 하면 예외를 던진다', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('999')).rejects.toThrow(
        NotFoundException,
      );

      expect(prisma.user.delete).not.toHaveBeenCalled();
    });
  });
});
