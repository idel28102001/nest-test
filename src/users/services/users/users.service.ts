import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/typeorm';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { encodePassword } from 'src/utils/bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

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
}
