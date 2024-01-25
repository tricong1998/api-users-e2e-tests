import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { DBCollectionName } from '../../shared';
import { UsersSchema } from './users.schema';
import { UsersService } from './users.service';
import { PointHistoryModule } from '../point-history/point-history.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DBCollectionName.USERS, schema: UsersSchema }]),
    PointHistoryModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
})
export class UsersModule {}
