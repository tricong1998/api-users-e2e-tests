import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DBCollectionName } from '../../shared';
import { PointHistorySchema } from './point-history.schema';
import { PointHistoryService } from './point-history.service';
import { PointHistoryRepository } from './point-history.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DBCollectionName.POINT_HISTORY, schema: PointHistorySchema },
    ]),
  ],
  providers: [PointHistoryService, PointHistoryRepository],
  exports: [PointHistoryService],
})
export class PointHistoryModule {}
