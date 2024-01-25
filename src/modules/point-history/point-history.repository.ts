import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/base/base-repository';
import { DBCollectionName } from 'src/shared';
import { PointHistoryDocument } from './point-history.schema';

@Injectable()
export class PointHistoryRepository extends BaseRepository<PointHistoryDocument> {
  constructor(
    @InjectModel(DBCollectionName.POINT_HISTORY)
    model: Model<PointHistoryDocument>,
  ) {
    super(model, {
      isSupportSoftDeleted: true,
    });
  }
}
