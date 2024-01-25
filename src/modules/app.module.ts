import { Module } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';
import { loggerConfig } from '../common/config/config-helper';
import * as pino from 'pino';
import { LoggerHelper } from '../common/logger/logger.helper';
import { DatabaseModule } from '../common/database/database.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    DatabaseModule,
    LoggerModule.forRootAsync({
      useFactory: async () => {
        return {
          pinoHttp: {
            ...loggerConfig,
            serializers: {
              err: pino.stdSerializers.err,
              req: (req: { body: any; raw: { body: any } }) => {
                req.body = req.raw.body;
                return req;
              },
            },
            customProps: () => ({
              correlationId: LoggerHelper.getCorrelationId(),
            }),
          },
          exclude: [],
        } as Params;
      },
    }),
    UsersModule,
  ],
  providers: [],
})
export class AppModule {}
