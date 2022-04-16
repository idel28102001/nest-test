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

  async findByPhone(phone: string, options?: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne({ where: { phone }, ...options });
  }

  async findByUsername(username: string, options?: FindOneOptions<UserEntity>) {
    return await this.userRepository.findOne({ where: { username }, ...options });
  }
  async register(dto: RegisterUserDto) {
    const user = await this.getOrCreate(dto);
    return await this.userRepository.save(user);
  }

  async getOrCreate(dto: RegisterUserDto) {
    const us = await this.userRepository.findOne({ where: { phone: dto.phone }, select: ['id', 'phoneCodeHash'] });
    if (!us) {
      const user = this.userRepository.create(dto);
      return user;
    }
    return this.userRepository.create({ ...us, ...dto });
  }

  async save(user) {
    return await this.userRepository.save(user);
  }

  async delete(username: string) {
    return await this.userRepository.delete({ username });
  }

  async makeAdmin(data: userFind) {
    const user = await this.userRepository.findOne(
      data);
    if (!user.roles.includes(Role.ADMIN)) {
      user.roles.push(Role.ADMIN);
      return await this.userRepository.save(user);
    } else {
      throw new ConflictException('Пользователь уже имеет роль admin');
    }
  }

  async unmakeAdmin(id: string) {
    const user = await this.userRepository.findOne(id);
    if (user.roles.includes(Role.ADMIN)) {
      user.roles = this.removeRole(user.roles, Role.ADMIN);
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

  create(data) {
    return this.userRepository.create(data);
  }
}
