import { Injectable, PipeTransform } from '@nestjs/common';
import { Role } from '../enums/role.enum';
import { ValidateService } from '../services/validate.service';

@Injectable()
export class HasAdminPipe implements PipeTransform {
  constructor(private readonly validateService: ValidateService) { }
  async transform(id: string) {
    if (id) {
      await this.validateService.checkRoleExists(id, Role.ADMIN);
    }
    return id;
  }
}