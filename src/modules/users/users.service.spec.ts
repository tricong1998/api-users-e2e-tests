import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { PointHistoryService } from '../point-history/point-history.service';
import { PointHistoryRepository } from '../point-history/point-history.repository';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, PointHistoryService, PointHistoryRepository],
    })
      .overrideProvider(UsersRepository)
      .useValue({})
      .overrideProvider(PointHistoryService)
      .useValue({})
      .overrideProvider(PointHistoryRepository)
      .useValue({})
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
