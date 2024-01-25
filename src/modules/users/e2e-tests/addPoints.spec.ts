import { INestApplication } from '@nestjs/common';
import { createRequestFunction, initTestApp } from '../../../shared/e2e-test.helpers';
import { Test } from '@nestjs/testing';
import { UsersRepository } from '../users.repository';
import { OBJECT_ID_MOCK, userMock } from './user.mock';
import { Gender, Nation, Role } from '../users.type';
import { AddPointDto } from '../dto/addPoints.dto';
import { UsersModule } from '../users.module';
import { DatabaseModule } from 'src/common/database/database.module';
import { PointHistoryRepository } from 'src/modules/point-history/point-history.repository';

jest.setTimeout(30000);

describe('Admin add points', () => {
  let app: INestApplication;
  let request: ReturnType<typeof createRequestFunction>;
  let usersRepository: UsersRepository;
  let pointHistoryRepository: PointHistoryRepository;
  let spies: jest.SpyInstance[] = [];
  const getEndpoint = (id: string) => `/users/${id}/add-points`;
  const method = 'patch';
  const input: AddPointDto = {
    point: 1,
  };
  const userMockData = { ...userMock, _id: OBJECT_ID_MOCK };

  beforeAll(async () => {
    [app] = await initTestApp(
      Test.createTestingModule({
        imports: [UsersModule, DatabaseModule],
      }),
    );
    request = createRequestFunction(app);
    usersRepository = app.get(UsersRepository);
    pointHistoryRepository = app.get(PointHistoryRepository);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    await app?.close();
  });

  beforeEach(async () => {
    // jest
    //   .useFakeTimers({
    //     doNotFake: [
    //       'nextTick',
    //       'setImmediate',
    //       'clearImmediate',
    //       'setInterval',
    //       'clearInterval',
    //       'setTimeout',
    //       'clearTimeout',
    //     ],
    //   } as any)
    //   .setSystemTime(cronRunTime);
    await usersRepository.createOne(userMockData);
  });

  afterEach(async () => {
    // jest.useRealTimers();
    spies.forEach((spy) => spy?.mockRestore());
    spies = [];
    await usersRepository.deleteMany({});
    await pointHistoryRepository.deleteMany({});
  });

  describe('Positive testing', () => {
    it('Add point successfully', async () => {
      const res = await request(getEndpoint(OBJECT_ID_MOCK), {
        expected: 200,
        method,
        body: input,
      });
      expect(res.body).toStrictEqual({
        gender: Gender.MALE,
        id: expect.any(String),
        name: 'name',
        nation: Nation.VIET_NAM,
        point: 3,
        role: Role.MANAGER,
        active: true,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        isDeleted: false,
      });

      const pointHistory = await pointHistoryRepository.findOne({
        userId: OBJECT_ID_MOCK,
      });

      expect(pointHistory?.toObject()).toStrictEqual({
        _id: expect.any(Object),
        __v: expect.any(Number),
        userId: res.body.id,
        totalPoint: 3,
        inputPoint: 1,
        balanceBefore: 0,
        balanceAfter: 3,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        isDeleted: false,
      });
    });
  });

  describe('Negative testing', () => {
    it('Point < 1 => Bad request', async () => {
      const res = await request(getEndpoint(OBJECT_ID_MOCK), {
        expected: 400,
        method,
        body: {
          ...input,
          point: 0,
        },
      });
      expect(res.body).toStrictEqual({
        statusCode: 400,
        message: ['point must not be less than 1'],
      });
    });
    it('Point is not integer => Bad request', async () => {
      const res = await request(getEndpoint(OBJECT_ID_MOCK), {
        expected: 400,
        method,
        body: {
          ...input,
          point: 1.1,
        },
      });
      expect(res.body).toStrictEqual({
        statusCode: 400,
        message: ['point must be an integer number'],
      });
    });
    it('Invalid Object Id', async () => {
      const res = await request(getEndpoint('invalidObjectId'), {
        expected: 400,
        method,
        body: input,
      });
      expect(res.body).toStrictEqual({
        statusCode: 400,
        message: ['id must be a bson object id'],
      });
    });
    it('Not found user with id', async () => {
      const res = await request(getEndpoint('65067925c36808ac1933aaaa'), {
        expected: 404,
        method,
        body: input,
      });
      expect(res.body).toStrictEqual({
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('Update user error, update history point will be rolled back', async () => {
      spies.push(
        jest.spyOn(usersRepository, 'updateById').mockRejectedValueOnce(new Error('test')),
      );
      const res = await request(getEndpoint(OBJECT_ID_MOCK), {
        expected: 500,
        method,
        body: input,
      });
      expect(res.body).toStrictEqual({
        statusCode: 500,
        errorCode: 500,
        message: 'test',
      });

      const userData = await usersRepository.findById(OBJECT_ID_MOCK);
      expect(userData?.toObject()).toStrictEqual({
        ...userMockData,
        __v: expect.any(Number),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        _id: expect.any(Object),
      });
      const pointHistory = await pointHistoryRepository.findOne({
        userId: OBJECT_ID_MOCK,
      });
      expect(pointHistory).toBeNull();
    });
  });
});
