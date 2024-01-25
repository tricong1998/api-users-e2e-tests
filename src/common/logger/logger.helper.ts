import * as httpContext from 'express-http-context';
import { uuid } from 'uuidv4';
import * as config from 'config';
import { pino } from 'pino';
// import * as BPromise from 'bluebird';
// import * as jsonWebToken from 'jsonwebtoken';
import { loggerConfig } from '../config/config-helper';
import { Helpers } from 'src/shared/helpers';

// const jwt = BPromise.promisifyAll(jsonWebToken);
export const CORRELATION_ID_KEY = 'correlationId';
export const logEnabled = loggerConfig.enabled;
const serviceName = config.get('service.name');
const env = process.env.NODE_ENV || 'development';
const logger = pino(loggerConfig);
enum LogLevel {
  Error,
  Warning,
  Info,
  Debug,
  Fatal,
}
const logLevelFunc = {
  [LogLevel.Error]: logger.error,
  [LogLevel.Warning]: logger.warn,
  [LogLevel.Info]: logger.info,
  [LogLevel.Debug]: logger.debug,
  [LogLevel.Fatal]: logger.fatal,
};

export type LogInput = {
  methodName: string;
  data?: Record<string, unknown>;
  msg?: string;
};

export class LoggerHelper {
  static setCorrelationId(req: any, _: any, next: any) {
    req.timestamp = Date.now();
    const correlationId = uuid();
    req.correlationId = correlationId;
    httpContext.set(CORRELATION_ID_KEY, correlationId);
    next();
  }

  static getCorrelationId() {
    let correlationId = httpContext.get(CORRELATION_ID_KEY);
    if (!correlationId) {
      correlationId = uuid();
      httpContext.set(CORRELATION_ID_KEY, correlationId);
    }
    return correlationId;
  }

  private static log(
    logLevel: LogLevel,
    {
      data,
      msg,
      methodName,
    }: {
      data?: any;
      msg?: string;
      methodName: string;
    },
  ): void {
    const logFunc = logLevelFunc[logLevel];

    const correlationId = this.getCorrelationId();
    const correlationIdMsg = !!correlationId ? `[${correlationId}]` : '';
    const methodNameMsg = !!methodName ? `[${methodName}]` : '';
    const message = `: ${msg}`;
    const host = `[${env}][${serviceName}]`;

    logFunc.call(
      logger,
      { ...data, correlationId },
      host + correlationIdMsg + methodNameMsg + message,
    );
  }

  static debugLog(input: LogInput): void {
    LoggerHelper.log(LogLevel.Debug, input);
  }

  static httpRequestLog(req: any) {
    const requestLog = {
      correlationId: req.correlationId,
      //   userId: decodeJWTToken(req.headers['access-token'])?.sub,
      msg: `HTTP Request`,
      methodName: 'Logger::requestLog',
      data: {
        method: req.method,
        originalUri: req.originalUrl,
        uri: req.url,
        referer: req.headers.referer || '',
        userAgent: req.headers['user-agent'],
        req: {
          body: Helpers.tryParseJsonString(Object.assign({}, req.body)),
          headers: req.headers,
        },
      },
    };
    LoggerHelper.log(LogLevel.Debug, requestLog);
  }

  static httpResponseLog = (req: any, res: any) => {
    const elapsedStart = req.timestamp ? req.timestamp : 0;
    const elapsedEnd = Date.now();
    const processTime = `${elapsedStart > 0 ? elapsedEnd - elapsedStart : 0}ms`;
    res.setHeader('x-request-id', req.correlationId);
    res.setHeader('x-process-time', processTime);
    const rawResponse = res.write;
    const rawResponseEnd = res.end;
    const chunks: Buffer[] = [];
    res.write = (...args: any[]) => {
      const restArgs = [];
      for (let i = 0; i < args.length; i++) {
        restArgs[i] = args[i];
      }
      chunks.push(Buffer.from(restArgs[0]));
      rawResponse.apply(res, restArgs);
    };
    res.end = (...args: any[]) => {
      const restArgs = [];
      for (let i = 0; i < args.length; i++) {
        restArgs[i] = args[i];
      }
      if (restArgs[0]) {
        chunks.push(Buffer.from(restArgs[0]));
      }
      const body = Buffer.concat(chunks).toString('utf8');
      const responseLog = {
        timestamp: new Date(elapsedEnd).toISOString(),
        correlationId: req.correlationId,
        level: LogLevel.Debug,
        // userId: decodeJWTToken(req.headers['access-token'])?.sub,
        msg: `HTTP Response - ${processTime}`,
        methodName: 'Logger ::responseLog',
        data: {
          req: {
            body: req.body,
            headers: req.headers,
          },
          res: {
            body: Helpers.tryParseJsonString(body),
            headers: res.getHeaders(),
          },
          statusCode: res.statusCode,
          method: req.method,
          originalUri: req.originalUrl,
          uri: req.url,
          userAgent: req.headers['user-agent'],
          processTime,
        },
      };
      LoggerHelper.log(LogLevel.Debug, responseLog);
      rawResponseEnd.apply(res, restArgs);
    };
  };
}
