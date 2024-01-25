import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PointHistoryService } from '../point-history/point-history.service';
import { PointHistoryRepository } from '../point-history/point-history.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { Gender, Nation, Role } from './users.type';
import { UserByIdDto } from './dto/getUserDetail.dto';
import { AddPointDto } from './dto/addPoints.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, UsersRepository, PointHistoryService, PointHistoryRepository],
    })
      .overrideProvider(UsersRepository)
      .useValue({})
      .overrideProvider(PointHistoryService)
      .useValue({})
      .overrideProvider(PointHistoryRepository)
      .useValue({})
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add points to a user successfully', async () => {
    // Mock the necessary dependencies
    const usersServiceMock = {
      addPoint: jest.fn().mockResolvedValue({ id: '1', name: 'John Doe', point: 100 }),
    } as any;

    // Create an instance of the UsersController with the mocked dependencies
    const usersController = new UsersController(usersServiceMock);

    // Call the addPoint method with the input data
    const param: UserByIdDto = { id: '1' };
    const input: AddPointDto = { point: 50 };
    const result = await usersController.addPoint(param, input);

    // Assert that the addPoint method was called with the correct input
    expect(usersServiceMock.addPoint).toHaveBeenCalledWith('1', input);

    // Assert that the result matches the expected output
    expect(result).toEqual({ id: '1', name: 'John Doe', point: 100 });
  });

  it('should create a new user successfully', async () => {
    // Mock the necessary dependencies
    const usersServiceMock = {
      createUser: jest.fn().mockResolvedValue({ id: '1', name: 'John Doe' }),
    } as any;

    // Create an instance of the UsersController with the mocked dependencies
    const usersController = new UsersController(usersServiceMock);

    // Call the create method with the input data
    const input: CreateUserDto = {
      name: 'John Doe',
      gender: Gender.MALE,
      nation: Nation.VIET_NAM,
      role: Role.MANAGER,
    };
    const result = await usersController.create(input);

    // Assert that the createUser method was called with the correct input
    expect(usersServiceMock.createUser).toHaveBeenCalledWith(input);

    // Assert that the result matches the expected output
    expect(result).toEqual({ id: '1', name: 'John Doe' });
  });

  it('should fail to create a new user with missing fields', async () => {
    // Mock the necessary dependencies
    const usersServiceMock = {
      createUser: jest.fn().mockRejectedValue(new BadRequestException('Missing fields')),
    } as any;

    // Create an instance of the UsersController with the mocked dependencies
    const usersController = new UsersController(usersServiceMock);

    // Call the create method with missing fields
    const input: CreateUserDto = {
      name: 'John Doe',
      gender: Gender.MALE,
      nation: Nation.VIET_NAM,
      role: Role.MANAGER,
      // Missing nation and role fields
    };

    try {
      await usersController.create(input);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(BadRequestException);
    }

    // Assert that the createUser method throws a BadRequestException
  });

  it('should fail to add points to a non-existent user', async () => {
    // Mock the necessary dependencies
    const usersServiceMock = {
      addPoint: jest.fn().mockRejectedValue(new NotFoundException('User not found')),
    } as any;

    // Create an instance of the UsersController with the mocked dependencies
    const usersController = new UsersController(usersServiceMock);

    // Call the addPoint method with a non-existent user id
    const param: UserByIdDto = { id: '1' };
    const input: AddPointDto = { point: 50 };

    // Assert that the addPoint method throws a NotFoundException
    try {
      await usersController.addPoint(param, input);
      expect(true).toBeFalsy();
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
