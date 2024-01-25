import * as config from 'config';
import { PinoConfig, PinoRedactConfig } from './config.type';

export const loggerConfig: PinoConfig = {
  ...config.get<PinoConfig>('logger'),
  redact: {
    ...config.get<PinoRedactConfig>('logger.redact'),
    paths:
      config.get<boolean>('logger.redact.enabled') && config.get<string[]>('logger.redact.paths')
        ? config.get('logger.redact.paths')
        : [],
  },
};
