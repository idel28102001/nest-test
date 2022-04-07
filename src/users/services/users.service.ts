import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }
  async findUserByUsername(username: string) {
    return this.userRepository.findOne({ where: { username } });
  }
  async findUserById(id: number) {
    return this.userRepository.findOne({ where: { id } });
  }
  async register(user: RegisterUserDto) {
    const password = encodePassword(user.password);
    const newUser = this.userRepository.create({ ...user, password });
    return await this.userRepository.save(newUser);
  }
  async save(user: UserEntity) {
    await this.userRepository.save(user);
  }
}
