import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let randomEmail: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            createUser: jest.fn(),
            findAllUsers: jest.fn(),
            findUserById: jest.fn(),
            updateUser: jest.fn(),
            deleteUser: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(UsersController);
    usersService = module.get(UsersService);
  });

  it('새로운 사용자를 생성할 수 있어야 합니다.', () => {
    randomEmail = `${Math.floor(Math.random() * 1000)}@example.com`;
    const user = { email: randomEmail, name: 'Test User' };
    usersService.createUser = jest.fn().mockResolvedValue(user);
    controller.create(user);
    expect(usersService.createUser).toHaveBeenCalledWith(user);
  });

  it('이메일로 사용자를 조회할 수 있어야 합니다.', () => {
    const user = { email: randomEmail, name: 'Test User' };
    usersService.findUserByEmail = jest.fn().mockResolvedValue(user);
    controller.findByEmail(randomEmail);
    expect(usersService.findUserByEmail).toHaveBeenCalledWith(randomEmail);
  });

  it('존재하지 않는 id 유저는 삭제할 수 없다.', () => {
    usersService.deleteUser = jest
      .fn()
      .mockRejectedValue(new NotFoundException('User not found'));
    expect(controller.remove('non-existent-id')).rejects.toThrow(
      NotFoundException,
    );
  });
});
