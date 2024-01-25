/* istanbul ignore file */

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LoggerHelper } from '../common/logger/logger.helper';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, call$: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    const req = ctx.getRequest();
    const res = ctx.getResponse();

    LoggerHelper.httpRequestLog(req);

    return call$.handle().pipe(
      map((data) => {
        LoggerHelper.httpResponseLog(req, res);
        return data;
      }),
    );
  }
}
