import { Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { config } from 'src/common/config';
import { UsersService } from 'src/users/services/users.service';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    if (username) {
      const user = await this.userService.findByUsername(username);
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
    const result = await this.userService.findByUsername(user.username, { select: ['username', 'id', 'roles'] });
    const { id, ...content } = result;
    const payload = { ...content, userId: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async makeAdmin(userId: string, secret: string) {
    if (secret !== config.get<string>('SECRET')) {
      throw new NotAcceptableException();
    }
    return await this.userService.makeAdmin({
      id: userId
    });
  }

  async unmakeAdmin(dto: { username: string }) {
    return await this.userService.unmakeAdmin(dto);
  }
}
