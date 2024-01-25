import { Injectable } from '@nestjs/common';
import { Helpers } from 'src/shared';
import { CreatePointHistory } from './point-history.type';
import { PointHistoryRepository } from './point-history.repository';
import { ClientSession } from 'mongoose';

@Injectable()
export class PointHistoryService {
  constructor(private pointHistoryRepository: PointHistoryRepository) {}

  async createPointHistory(input: CreatePointHistory, { session }: { session: ClientSession }) {
    const pointHistory = await this.pointHistoryRepository.createOne(
      {
        ...input,
        balanceBefore: input.currentBalance,
        balanceAfter: input.currentBalance + input.totalPoint,
        totalPoint: input.totalPoint,
        inputPoint: input.inputPoint,
      },
      { session },
    );
    return Helpers.db2api(pointHistory);
  }
}
