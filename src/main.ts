import { ConsoleLogger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  // Set app prefix
  app.setGlobalPrefix(constants.app.apiPrefix || 'api');

  // Enabling API versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Enable global validation
  app.useGlobalPipes(new ValidationPipe());

  // Apply global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Apply global error handler
  app.useGlobalFilters(new HttpExceptionFilter());

  //  Set up Swagger
  const config = new DocumentBuilder()
    .setTitle(constants.app.name as string)
    .setDescription('API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(constants.app.port ?? 3000);
}
bootstrap();
