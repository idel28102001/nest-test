import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { Role } from '../enums/role.enum';
import { userFind } from '../interfaces/userFind.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}
  async findById(id: string, options?: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne(id, options);
  }

  async findByUsername(username: string, options?: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne({ where: { username }, ...options });
  }
  async register(dto: RegisterUserDto) {
    const user = this.userRepository.create(dto);
    return await this.userRepository.save(user);
  }
  async save(user: UserEntity) {
    return await this.userRepository.save(user);
  }

  async delete(username: string) {
    return await this.userRepository.delete({ username });
  }

  async makeAdmin(data: userFind) {
    const user = await this.checkRoleExists(
      data
      , Role.ADMIN);
    if (!user.roles.includes(Role.ADMIN)) {
      user.roles.push(Role.ADMIN);
      return await this.userRepository.save(user);
    } else {
      throw new ConflictException('Пользователь уже имеет роль admin');
    }
  }

  async unmakeAdmin(data: userFind) {
    const role = Role.ADMIN;
    const user = await this.checkRoleExists(data, role);
    if (user.roles.includes(role)) {
      user.roles = this.removeRole(user.roles, role);
      return await this.userRepository.save(user);
    } else {
      throw new ConflictException('Пользователь не имеет роль admin');
    }
  }

  removeRole(array: Role[], role: Role) {
    const index = array.indexOf(role);
    if (index !== -1) {
      array.splice(index, 1);
    }
    return array;
  }

  async checkRoleExists(data: userFind, role: Role) {
    const user = await this.userRepository.findOne({ where: data, select: ['roles', 'id'] });
    return user;
  }
}
