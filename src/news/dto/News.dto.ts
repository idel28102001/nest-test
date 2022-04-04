import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NewsDto {
  @ApiProperty()
  @IsNotEmpty()
  description: string;
}
