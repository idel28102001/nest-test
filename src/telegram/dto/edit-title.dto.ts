import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class editTitleDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsUUID()
  id: string;
}