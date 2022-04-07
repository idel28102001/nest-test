import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class adminDto {
  @ApiProperty()
  @IsNotEmpty()
  secret: string;
}