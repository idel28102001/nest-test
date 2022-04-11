import { Injectable, PipeTransform } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ValidateService } from '../services/validate.service';

@Injectable()
export class HasAdminPipe implements PipeTransform {
  constructor(private readonly validateService: ValidateService) { }
  async transform(dto: { username: string }) {
    if (dto.username) {
      await this.validateService.checkRoleExists(dto.username, Role.ADMIN);
    }
    return dto;
  }
}