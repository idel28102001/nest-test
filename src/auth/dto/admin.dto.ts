import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AdminDto {
  @ApiProperty()
  @IsNotEmpty()
  secret: string;
}