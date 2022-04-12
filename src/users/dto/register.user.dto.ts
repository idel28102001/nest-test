import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class RegisterUserDto {
  @ApiProperty()
  @IsNotEmpty()
  username?: string;

  @ApiProperty()
  @IsNotEmpty()
  password?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber()
  phone: string;


  @ApiPropertyOptional()
  phoneCodeHash?: string;
}
