import { NestFactory } from '@nestjs/core';
import { DailySubsidyCronModule } from './deactivate-users-cron.module';
import { INestApplicationContext } from '@nestjs/common';
import { LoggerHelper } from 'src/common/logger/logger.helper';
import { UsersService } from 'src/modules/users/users.service';

const programName = 'deactivate-users-cron';

export class Program {
  app: INestApplicationContext;
  usersService: UsersService;

  async main() {
    await this.initialize();
    await this.process();
    LoggerHelper.debugLog({ methodName: programName, msg: 'FINISH' });
    await this.end();
  }

  async initialize() {
    LoggerHelper.debugLog({ methodName: programName, msg: 'INIT' });
    this.app = await this.getApp();
    this.usersService = this.app.get(UsersService);
  }

  async process() {
    const methodName = `${programName}::process`;
    LoggerHelper.debugLog({ methodName, msg: 'START' });
    await this.usersService.deactivateUsers();
    LoggerHelper.debugLog({ methodName, msg: 'FINISH' });
  }

  async getApp() {
    return NestFactory.createApplicationContext(DailySubsidyCronModule);
  }

  async end() {
    return this.app.close();
  }
}

export const run = () => {
  new Program()
    .main()
    .then(() => {
      process.exit(0);
    })
    .catch((e) => {
      LoggerHelper.debugLog({ methodName: programName, data: e });
      process.exit(-1);
    });
};
