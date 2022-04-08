import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ContentEntity } from 'src/contents/entities/content.entity';
import { PostsEntity } from 'src/posts/entities/posts.entity';
import { RolesEntity } from 'src/roles/entities/roles.entity';
import { TelegramEntity } from 'src/telegram/entities/telegram.entity';
import { UserEntity } from 'src/users/entities/user.entity';

class Config {
  private config: ConfigService;
  constructor() {
    this.config = new ConfigService(); // it all works btw
  }

  public get<T = any>(propertyPath: string, defaultValue?: T) {
    return this.config.get(propertyPath, defaultValue);
  }

  public getForJwt() {
    return {
      secret: this.get('SECRET'),
      signOptions: {
        expiresIn: this.get('EXPIRES')
      }
    }
  }


  public getDatabaseOptions(): TypeOrmModuleOptions {
    return {
      type: this.get('DB_TYPE'),
      host: this.get('DB_HOST'),
      port: this.get('DB_PORT'),
      username: this.get('DB_USERNAME'),
      password: this.get('DB_PASSWORD'),
      database: this.get('DB_NAME'),
      entities: [UserEntity, PostsEntity, ContentEntity, TelegramEntity, RolesEntity],
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
