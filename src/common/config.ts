import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ContentEntity } from 'src/news/entities/content.entity';
import { PostsEntity } from 'src/news/entities/posts.entity';
import { TelegramEntity } from 'src/telegram/entities/telegram.entity';
import { UserEntity } from 'src/users/entities/user.entity';

class Config {
  private config: ConfigService;
  constructor() {
    this.config = new ConfigService();
  }

  public get<T = any>(propertyPath: string, defaultValue?: T) {
    return this.config.get(propertyPath, defaultValue);
  }
  public getDatabaseOptions(): TypeOrmModuleOptions {
    return {
      type: this.get('DB_TYPE'),
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
      entities: [UserEntity, PostsEntity, ContentEntity, TelegramEntity],
      synchronize: true,
    };
  }
  public getAdminSecret(): string {
    return this.get<string>('ADMIN_SECRET');
  }

  public telegramToken(): string {
    return this.get('TELEGRAM_TOKEN');
  }
}

export const config = new Config();
