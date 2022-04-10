import { Injectable, PipeTransform } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register.user.dto';
import { ValidateService } from '../services/validate.service';

@Injectable()
export class UsernameUniquePipe implements PipeTransform {
  constructor(private readonly validateService: ValidateService) { }
  async transform(dto: RegisterUserDto) {
    if (dto.username) {
      await this.validateService.checkUsernameExists(dto.username);
    } return dto;

  }
}