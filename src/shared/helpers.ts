import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as config from 'config';
import { Model } from 'mongoose';
import { LoggerInterceptor } from '../interceptors/logger.interceptor';
import * as httpContext from 'express-http-context';
import * as responseTime from 'response-time';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { LoggerHelper } from 'src/common/logger/logger.helper';

export class Helpers {
  static tryParseJsonString(value: any): any {
    try {
      return JSON.parse(value);
    } catch (err) {
      return value;
    }
  }

  static db2api<T1, T2>(db: T1, exclude?: string[]): T2 | T2[] | null | undefined {
    if (db === null) {
      return null;
    }
    if (db === undefined) {
      return undefined;
    }

    let response: T2 | T2[];

    if (Array.isArray(db)) {
      response = [];
      for (const obj of db) {
        response.push(Helpers.convertObject(obj, exclude));
      }
    } else {
      response = Helpers.convertObject<T2>(db, exclude);
    }

    return response;
  }

  static convertObject<T>(dbObj: any, exclude?: Array<string>): T {
    const apiObj: Record<string, unknown> = {};

    if (dbObj instanceof Model) {
      dbObj = dbObj.toObject();
    }

    for (let name of Object.keys(dbObj)) {
      let value = dbObj[name];

      if (name === '_id') {
        name = 'id';
        value = value.toString();
      }

      if (name.indexOf('_') === 0) {
        continue;
      }

      if (exclude && exclude.indexOf(name) >= 0) {
        continue;
      }

      apiObj[name] = value;
    }

    return apiObj as T;
  }

  static configApp(app: INestApplication) {
    app.enableCors({
      // exposedHeaders: CORS_EXPOSED_HEADERS,
    });
    app.setGlobalPrefix(config.get('service.baseUrl'));
    app.useGlobalInterceptors(new LoggerInterceptor());
    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );
    app.use(httpContext.middleware);
    app.use(responseTime({ header: 'x-response-time' }));
    app.use(LoggerHelper.setCorrelationId);
  }

  static isStringTooLong(msg: string, capacity = 4999) {
    return msg.length > capacity;
  }
}
