import { INestApplication } from '@nestjs/common';
import { TestingModuleBuilder } from '@nestjs/testing';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import * as supertest from 'supertest';
import * as dbHelpers from '../common/database/database.helpers';
import * as config from 'config';
import { Helpers } from './helpers';

export class MongoMemoryReplSetManager {
  private static replicasInstance: MongoMemoryReplSet;

  static setInstance(replicasInstance: MongoMemoryReplSet) {
    this.replicasInstance = replicasInstance;
  }

  static async getInstance(): Promise<MongoMemoryReplSet> {
    return MongoMemoryReplSetManager.replicasInstance;
  }
}

export const createRequestFunction = (
  app: INestApplication,
  headers: {
    sub?: string;
  } = {},
) =>
  async function request(
    url: string,
    {
      expected,
      method,
      body,
      contentType = 'application/json',
      accept = 'application/json',
      attachment,
      query,
    }: {
      expected: number;
      method: 'get' | 'post' | 'put' | 'patch' | 'delete';
      body?: any;
      contentType?: string;
      accept?: string;
      attachment?: {
        name: string;
        file: string;
      };
      query?: Record<string, any>;
    },
  ) {
    const agent = supertest.agent(app.getHttpServer());
    const req = agent[method](url)
      .set('Accept', accept)
      .set('sub', headers.sub || 'sub')
      .set('access-token', 'mock-token');

    for (const key of Object.keys(headers)) {
      req.set(key, (headers as any)[key]);
    }
    if (attachment) {
      req.attach(attachment.name, attachment.file);
    }
    if (query) {
      req.query(query);
    }
    const reqAfterSend = body ? req.set('Content-Type', contentType).send(body) : req;
    return reqAfterSend.expect(expected).then((res) => res);
  };

export const initTestApp = async (overrides: TestingModuleBuilder): Promise<[INestApplication]> => {
  const replSet = await MongoMemoryReplSetManager.getInstance();
  const uri = replSet.getUri();

  const dbUrl = `${uri}&retryWrites=false`;
  jest.spyOn(dbHelpers, 'createMongooseOptions').mockReturnValue({
    uri: dbUrl,
    dbName: config.get<string>('mongodb.dbName'),
  });

  const testBuilder = overrides;

  const fixture = await testBuilder.compile();

  const app = fixture.createNestApplication();
  Helpers.configApp(app);

  await app.init();
  return [app];
};
