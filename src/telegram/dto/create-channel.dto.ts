import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateChannelDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  about: string;
}