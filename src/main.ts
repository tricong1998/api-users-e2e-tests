import * as dotenv from 'dotenv';
dotenv.config(); // Not move this line to other position line 2
import * as config from 'config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { LoggerHelper } from './common/logger/logger.helper';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { Helpers } from './shared';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // cors: true,
  });
  Helpers.configApp(app);
  await setupSwagger(app);
  await app.listen(config.get('server.port'));
}

(async () => {
  await bootstrap();
  LoggerHelper.debugLog({
    methodName: 'bootstrap',
    msg: `Start service at ${config.get('server.host')}:${config.get('server.port')}}`,
  });
  LoggerHelper.debugLog({
    methodName: 'bootstrap',
    msg: `Swagger docs at ${config.get('server.host')}:${config.get('server.port')}/docs`,
  });
})();

async function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('api-users')
    .setDescription('The users API description')
    .setVersion('1.0')
    .addTag('users')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
}
