import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import entities from '../typeorm';

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
      entities,
      synchronize: true,
    };
  }
}

export const config = new Config();
