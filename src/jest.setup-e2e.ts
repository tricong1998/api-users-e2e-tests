import { MongoMemoryReplSet } from 'mongodb-memory-server';
import { MongoMemoryReplSetManager } from './shared/e2e-test.helpers';

jest.setTimeout(30000);

beforeAll(async () => {
  const instance = new MongoMemoryReplSet({
    replSet: {
      storageEngine: 'wiredTiger',
    },
  });
  await instance.start();
  MongoMemoryReplSetManager.setInstance(instance);
});

afterAll(async () => {
  (await MongoMemoryReplSetManager.getInstance()).stop();
});
