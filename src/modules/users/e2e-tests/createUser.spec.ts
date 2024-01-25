import { INestApplication } from '@nestjs/common';
import { createRequestFunction, initTestApp } from '../../../shared/e2e-test.helpers';
import { Test } from '@nestjs/testing';
import * as _ from 'lodash';
import { UsersRepository } from '../users.repository';
import { CreateUserDto } from '../dto/createUser.dto';
import { userMock } from './user.mock';
import { Gender, Nation, Role } from '../users.type';
import { UsersModule } from '../users.module';
import { DatabaseModule } from 'src/common/database/database.module';

jest.setTimeout(30000);

describe('Admin create users', () => {
  let app: INestApplication;
  let request: ReturnType<typeof createRequestFunction>;
  let usersRepository: UsersRepository;
  let spies: jest.SpyInstance[] = [];
  const getEndpoint = () => `/users`;
  const method = 'post';
  const input: CreateUserDto = {
    ..._.pick(userMock, ['name', 'gender', 'nation', 'role']),
  };

  beforeAll(async () => {
    [app] = await initTestApp(
      Test.createTestingModule({
        imports: [UsersModule, DatabaseModule],
      }),
    );
    request = createRequestFunction(app);
    usersRepository = app.get(UsersRepository);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await app?.close();
  });

  beforeEach(async () => {});

  afterEach(async () => {
    spies.forEach((spy) => spy?.mockRestore());
    spies = [];
    await usersRepository.deleteMany({});
  });

  describe('Positive testing', () => {
    it('Create successfully', async () => {
      const res = await request(getEndpoint(), {
        expected: 201,
        method,
        body: input,
      });
      const newUserData = {
        gender: Gender.MALE,
        id: expect.any(String),
        name: 'name',
        nation: Nation.VIET_NAM,
        point: 0,
        role: Role.MANAGER,
        active: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        isDeleted: false,
      };
      expect(res.body).toStrictEqual(newUserData);
    });
  });

  describe('Negative testing', () => {
    it('Create without required fields', async () => {
      const res = await request(getEndpoint(), {
        expected: 400,
        method,
        body: {},
      });
      expect(res.body).toStrictEqual({
        statusCode: 400,
        message: [
          'name should not be empty',
          'gender must be one of the following values: male, female, another',
          'nation must be one of the following values: viet-nam, another',
          'role must be one of the following values: manager, member',
        ],
      });
    });
    it('Create with invalid gender value', async () => {
      const res = await request(getEndpoint(), {
        expected: 400,
        method,
        body: {
          ...input,
          gender: 'invalid_gender',
        },
      });
      expect(res.body).toStrictEqual({
        statusCode: 400,
        message: ['gender must be one of the following values: male, female, another'],
      });
    });
    it('Create with invalid nation value', async () => {
      const res = await request(getEndpoint(), {
        expected: 400,
        method,
        body: {
          ...input,
          nation: 'invalid_nation',
        },
      });
      expect(res.body).toStrictEqual({
        message: ['nation must be one of the following values: viet-nam, another'],
        statusCode: 400,
      });
    });
    it('Create with invalid role value', async () => {
      const res = await request(getEndpoint(), {
        expected: 400,
        method,
        body: {
          ...input,
          role: 'invalid_role',
        },
      });
      expect(res.body).toStrictEqual({
        statusCode: 400,
        message: ['role must be one of the following values: manager, member'],
      });
    });
  });
});
