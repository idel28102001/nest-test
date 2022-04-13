import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class editPhotoDto {
  @ApiProperty()
  @IsUUID()
  id: string;
}