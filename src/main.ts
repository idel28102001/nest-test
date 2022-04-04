import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './common/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(config.get('PORT', 3000));
}
bootstrap();
