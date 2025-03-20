import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { constants } from './config/constants';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ResponseInterceptor } from './interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'ConquerAPI',
    }),
  });
  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Apply global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Apply global error handler
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(constants.app.port ?? 3000);
}
bootstrap();
