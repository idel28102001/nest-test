import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString, IsPhoneNumber } from 'class-validator';

export class ConfirmPhoneDto {

  @ApiProperty()
  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsNumberString()
  @IsNotEmpty()
  code: string;
}