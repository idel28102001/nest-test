import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/common/config';
import { RolesService } from 'src/roles/services/roles.service';
import { UsersService } from 'src/users/services/users.service';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly rolesService: RolesService,
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
    const roles = await this.rolesService.getRolesArrayById(id);
    const payload = {
      username: user.username, userId: id, roles: roles
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async makeAdmin(userId: string, secret: string) {
    if (secret !== config.get<string>('SECRET')) {
      throw new NotAcceptableException();
    }
    await this.rolesService.makeAdmin(userId);
  }
}
