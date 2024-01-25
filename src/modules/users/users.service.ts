import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { AddPointDto } from './dto/addPoints.dto';
import { UserHelpers } from './users.helper';
import { Helpers } from 'src/shared';
import { ClientSession } from 'mongoose';
import { PointHistoryService } from '../point-history/point-history.service';
import { UsersDocument, UsersSchemaClass } from './users.schema';
import { FREEZE_TIME } from './users.type';

@Injectable()
export class UsersService {
  constructor(
    private usersRepo: UsersRepository,
    private pointHistoryService: PointHistoryService,
  ) {}

  async createUser(input: CreateUserDto) {
    const user = await this.usersRepo.createOne(input);
    return Helpers.db2api(user);
  }

  async addPoint(userId: string, input: AddPointDto): Promise<UsersSchemaClass> {
    const user = await this.usersRepo.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const additionalPoint = UserHelpers.calculatePoints(input.point, user);
    const newData = await this.usersRepo.withTransaction(async (session: ClientSession) => {
      //   const [updatedUser] = await Promise.all([
      //     this.usersRepo.updateById(
      //       userId,
      //       {
      //         $inc: {
      //           point: additionalPoint,
      //         },
      //       },
      //       { session },
      //     ),
      //     this.pointHistoryService.createPointHistory(
      //       {
      //         userId,
      //         totalPoint: additionalPoint,
      //         currentBalance: user.point,
      //         inputPoint: input.point,
      //       },
      //       { session },
      //     ),
      //   ]);
      const updatedUser = await this.usersRepo.updateById(
        userId,
        {
          $inc: {
            point: additionalPoint,
          },
        },
        { session },
      );
      await this.pointHistoryService.createPointHistory(
        {
          userId,
          totalPoint: additionalPoint,
          currentBalance: user.point,
          inputPoint: input.point,
        },
        { session },
      );
      return updatedUser;
    });

    return Helpers.db2api<UsersDocument, UsersSchemaClass>(
      newData as UsersDocument,
    ) as UsersSchemaClass;
  }

  async deactivateUsers() {
    return this.usersRepo.updateMany(
      {
        active: true,
        point: 0,
        createdAt: {
          $lt: new Date(Date.now() - FREEZE_TIME),
        },
      },
      {
        active: false,
      },
    );
  }
}
