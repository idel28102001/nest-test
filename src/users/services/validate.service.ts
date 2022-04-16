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

  async checkExistingPhone(phone: string): Promise<boolean> {
    const user = await this.usersService.findByPhone(phone);
    const hasPassword = user ? user.password : null;
    if (user && hasPassword) {
      throw new ConflictException('Телефон уже зарегистрирован в системе');
    }
    return true;
  }

  async checkRoleExists(id: string, role: Role, reverse = false) {
    const user = await this.usersService.findById(id);
    let haveRole = user.roles.includes(role);
    haveRole = reverse ? !haveRole : haveRole;
    const text = reverse ? 'уже есть' : 'отсутсвует'
    if (!haveRole) {
      throw new ConflictException(`Роль admin ${text} у пользователя`)
    }
    return true;
  }
}