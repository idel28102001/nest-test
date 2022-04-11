import { ConflictException, Injectable } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { UsersService } from './users.service';

@Injectable()
export class ValidateService {
  constructor(
    private readonly usersService: UsersService) {}

  async checkUsernameExists(username: string) {
    const user = await this.usersService.findByUsername(username);
    if (user) {
      throw new ConflictException('Данный username уже зарегистрирован в системе');
    }
    return true;
  }

  async checkRoleExists(username: string, role: Role, reverse = false) {
    const user = await this.usersService.checkRoleExists({
      username
    }, role);
    let haveRole = user.roles.includes(role);
    haveRole = reverse ? !haveRole : haveRole;
    const text = reverse ? 'уже есть' : 'отсутсвует'
    if (!haveRole) {
      throw new ConflictException(`Роль admin ${text} у пользователя`)
    }
    return true;
  }
}