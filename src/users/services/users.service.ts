import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesEntity } from 'src/users/entities/roles.entity';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RolesEntity)
    private readonly rolesRepository: Repository<RolesEntity>,
  ) { }
  async findUserByUsername(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
  async findUserById(id: string) {
    return await this.userRepository.findOne({ where: { id } });
  }
  async register(user: RegisterUserDto) {
    const newUser = this.userRepository.create({ ...user });
    const currUser = await this.userRepository.save(newUser);
    const { role } = await this.rolesRepository.save({ userId: currUser.id })
    return { role, ...currUser };
  }
  async save(user: UserEntity) {
    await this.userRepository.save(user);
  }
}
