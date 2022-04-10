import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { RolesEntity } from './entities/roles.entity';
import { ValidateService } from './services/validate.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RolesEntity])],
  controllers: [UsersController],
  providers: [UsersService, ValidateService],
  exports: [UsersService, ValidateService],
})
export class UsersModule { }
