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
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async makeAdmin(userId: string, secret: string) {
    const adminSecret = config.getAdminSecret();
    if (adminSecret !== secret) {
      throw new NotAcceptableException();
    }
    const user = await this.userService.findUserById(parseInt(userId));
    user.role = 'admin';
    await this.userService.save(user);
  }
}
