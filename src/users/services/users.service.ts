import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { RolesEntity } from '../entities/roles.entity';
import { UserEntity } from '../entities/user.entity';
import { userFind } from '../interfaces/userFind.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) { }
  async findById(id: string, options?: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne(id, options);
  }

  async findByUsername(username: string, options?: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne({ where: { username }, ...options });
  }
  async register(user: RegisterUserDto) {
    const role = this.rolesRepository.create();
    const newUser = this.userRepository.create(user);
    newUser.roles = [role];
    return await this.userRepository.save(newUser);
  }
  async save(user: UserEntity) {
    return await this.userRepository.save(user);
  }

  async delete(username: string) {
    return await this.userRepository.delete({ username });
  }

  async makeAdmin(data: userFind) {
    const { haveRole, user } = await this.checkRoleExists(
      data
      , 'admin');
    if (!haveRole) {
      const adminRole = this.rolesRepository.create({ role: 'admin' });
      user.roles.push(adminRole);
      return await this.userRepository.save(user);
    } else {
      throw new ConflictException('Пользователь уже имеет роль admin');
    }
  }

  async unmakeAdmin(data: userFind) {
    const { haveRole, role } = await this.checkRoleExists(data, 'admin');
    if (haveRole) {
      return await this.rolesRepository.delete(role.id);
    } else {
      throw new ConflictException('Пользователь не имеет роль admin');
    }
  }

  async checkRoleExists(data: userFind, role: string) {
    const user = await this.userRepository.findOne({ where: data, relations: ['roles'], select: ['roles', 'id'] });
    const haveRole = user.roles.map(e => e.role).includes(role);
    const userRole = user.roles.find(e => e.role === role);
    return { user, haveRole, role: userRole };
  }
}
