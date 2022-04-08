import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolesEntity } from '../entities/roles.entity';
import { RolesInterface } from '../interface/roles.interface';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(RolesEntity)
  private readonly rolesRepository: Repository<RolesEntity>,) { }

  async save(data: RolesInterface) {
    return await this.rolesRepository.save(data)
  }

  async getRolesArrayById(userId: string) {
    const roles = await this.rolesRepository.find({ where: { userId }, select: ['role'] });
    return roles.map(e => e.role);
  }

  async makeAdmin(userId: string) {
    const role = await this.rolesRepository.findOne({ where: { userId, role: 'admin' } });
    if (!role) {
      await this.rolesRepository.save({ userId, role: 'admin' });
    }
  }
}
