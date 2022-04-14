import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString } from 'class-validator';

export class addChannelDto {
  @ApiProperty()
  @IsNumberString()
  channelId: string;
}