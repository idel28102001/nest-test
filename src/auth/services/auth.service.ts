import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { config } from 'src/common/config';
import { RolesEntity } from 'src/users/entities/roles.entity';
import { UsersService } from 'src/users/services/users.service';
import { comparePasswords } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
    private jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string) {
    if (username) {
      const user = await this.userService.findUserByUsername(username);
      if (user) {
        const check = comparePasswords(password, user.password);
        if (check) {
          const { id, username, ...result } = user;
          return { id, username };
        }
      }
    }
    return null;
  }

  async login(user: any) {
    const { id } = await this.userService.findUserByUsername(user.username);
    const roles = await this.rolesRepository.find({ where: { userId: id }, select: ['role'] });
    const payload = {
      username: user.username, userId: id, roles: roles.map(e => e.role)
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async makeAdmin(userId: string, secret: string) {
    if (secret !== config.get<string>('SECRET')) {
      throw new NotAcceptableException();
    }
    const role = await this.rolesRepository.findOne({ where: { userId, role: 'admin' } });
    if (!role) {
      await this.rolesRepository.save({ userId, role: 'admin' });
    }
  }
}
