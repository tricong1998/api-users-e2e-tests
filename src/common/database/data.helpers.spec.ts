import * as config from 'config';
import { createMongooseOptions } from './database.helpers';

describe('data.helpers', () => {
  it('should return a MongooseModuleOptions object with the correct uri, dbName, and auth properties when given a valid uriConfigPath', () => {
    const uriConfigPath = 'validUriConfigPath';
    const expectedOptions = {
      uri: 'validUri',
      dbName: 'validDbName',
      auth: {
        username: 'validUsername',
        password: 'validPassword',
      },
    };

    jest.spyOn(config, 'get').mockReturnValueOnce('validUri');
    jest.spyOn(config, 'get').mockReturnValueOnce('validDbName');
    jest.spyOn(config, 'get').mockReturnValueOnce('validUsername');
    jest.spyOn(config, 'get').mockReturnValueOnce('validPassword');

    const options = createMongooseOptions(uriConfigPath);

    expect(options).toEqual(expectedOptions);
  });
});
