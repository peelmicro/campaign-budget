import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({ json: true }),
  });
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true }),
  );
  const port = process.env.PORT || 3000;
  await app.listen(port);
  new ConsoleLogger('Bootstrap').log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
