import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepository } from 'src/shared/base/base-repository';
import { DBCollectionName } from 'src/shared';
import { UsersDocument } from './users.schema';

@Injectable()
export class UsersRepository extends BaseRepository<UsersDocument> {
  constructor(
    @InjectModel(DBCollectionName.USERS)
    model: Model<UsersDocument>,
  ) {
    super(model, {
      isSupportSoftDeleted: true,
    });
  }
}
