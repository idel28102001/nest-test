import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { NewsModule } from './news/news.module';
import { UsersController } from './users/controllers/users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './common/config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    NewsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => config.getDatabaseOptions(),
    }),
  ],
  controllers: [UsersController],
  exports: [],
})
export class AppModule {}
