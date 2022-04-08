import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RolesService } from 'src/roles/services/roles.service';
import { RegisterUserDto } from 'src/users/dto/register.user.dto';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly rolesService: RolesService,
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
    const { role } = await this.rolesService.save({ userId: currUser.id });
    return { role, ...currUser };
  }
  async save(user: UserEntity) {
    await this.userRepository.save(user);
  }
}
