import { INestApplicationContext } from '@nestjs/common';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Program } from './deactivate-users-cron.impl';
import { initTestApp } from '../../shared/e2e-test.helpers';
import { Test } from '@nestjs/testing';
import { modules } from './deactivate-users-cron.module';
import { UsersRepository } from 'src/modules/users/users.repository';
import * as moment from 'moment';
import { FREEZE_TIME } from 'src/modules/users/users.type';
import { userMock } from 'src/modules/users/e2e-tests/user.mock';
jest.setTimeout(30000);

describe('daily-subsidy-cron', () => {
  let app: INestApplicationContext;
  let db: MongoMemoryServer;
  let program: Program;
  let spies: jest.SpyInstance[] = [];
  let usersRepository: UsersRepository;

  const objectIds = {
    userWithZeroPointAndCreatedMore30Days: '65067925c36808ac1933aaa1',
    userWithZeroPointCreatedLess30Days: '65067925c36808ac1933aaa2',
    userWithPointGreaterThanZeroAndCreatedMore30Days: '65067925c36808ac1933aaa3',
    userWithPointGreaterThanZeroAndCreatedLess30Days: '65067925c36808ac1933aaa4',
  };
  beforeAll(async () => {
    [app] = await initTestApp(
      Test.createTestingModule({
        imports: [...modules],
      }),
    );
    program = new Program();
    usersRepository = app.get(UsersRepository);
  });

  afterAll(async () => {
    await Promise.all([app?.close(), db?.stop()]);
  });

  afterEach(async () => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
    jest.resetAllMocks();
    spies.forEach((spy) => spy?.mockRestore());
    spies = [];
    await usersRepository.deleteMany({});
  });

  beforeEach(async () => {
    spies.push(
      jest.spyOn(program, 'getApp').mockResolvedValue(app),
      jest.spyOn(program, 'end').mockResolvedValue(),
    );
    const oneDayTime = 60 * 60 * 24;
    const thresholdTime = moment().subtract(FREEZE_TIME, 'milliseconds');
    await usersRepository.createMany([
      {
        ...userMock,
        point: 1,
        _id: objectIds.userWithPointGreaterThanZeroAndCreatedLess30Days,
        createdAt: thresholdTime.add(oneDayTime, 'seconds').toDate(),
      },
      {
        ...userMock,
        point: 0,
        _id: objectIds.userWithZeroPointCreatedLess30Days,
        createdAt: thresholdTime.add(oneDayTime, 'seconds').toDate(),
      },
      {
        ...userMock,
        point: 1,
        _id: objectIds.userWithPointGreaterThanZeroAndCreatedMore30Days,
        createdAt: thresholdTime.subtract(1, 'day').toDate(),
      },
      {
        ...userMock,
        point: 0,
        _id: objectIds.userWithZeroPointAndCreatedMore30Days,
        createdAt: thresholdTime.subtract(1, 'day').toDate(),
      },
    ]);
  });

  it('Should deactivate correct users', async () => {
    await program.main();
    const users = await usersRepository.findMany({}, undefined, {
      lean: true,
    });
    // users.forEach((u) => {
    //   if (u._id.toString() === objectIds.userWithZeroPointAndCreatedMore30Days) {
    //     expect(u.active).toBeFalsy();
    //   } else {
    //     expect(u.active).toBeTruthy();
    //   }
    // });
    const user1 = users.find(
      (u) => u._id.toString() === objectIds.userWithZeroPointAndCreatedMore30Days,
    );
    expect(user1?.active).toBeFalsy();

    const user2 = users.find(
      (u) => u._id.toString() === objectIds.userWithPointGreaterThanZeroAndCreatedMore30Days,
    );

    expect(user2?.active).toBeTruthy();

    const user3 = users.find(
      (u) => u._id.toString() === objectIds.userWithZeroPointCreatedLess30Days,
    );
    expect(user3?.active).toBeTruthy();

    const user4 = users.find(
      (u) => u._id.toString() === objectIds.userWithPointGreaterThanZeroAndCreatedLess30Days,
    );
    expect(user4?.active).toBeTruthy();
  });
});
