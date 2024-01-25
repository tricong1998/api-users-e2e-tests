import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as config from 'config';

export function createMongooseOptions(uriConfigPath: string): MongooseModuleOptions {
  return {
    uri: config.get<string>(uriConfigPath),
    dbName: config.get<string>('mongodb.dbName'),
    auth: {
      username: config.get<string>('mongodb.username'),
      password: config.get<string>('mongodb.password'),
    },
  };
}
