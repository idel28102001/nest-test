import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from 'src/users/services/users.service';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { config } from 'src/common/config';
import { UserEntity } from 'src/users/entities/user.entity';
import { RolesEntity } from 'src/users/entities/roles.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RolesEntity]),
    PassportModule,
    JwtModule.registerAsync({ useFactory: () => config.getForJwt() }),
  ],
  providers: [AuthService, UsersService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService, LocalStrategy],
})
export class AuthModule { }
