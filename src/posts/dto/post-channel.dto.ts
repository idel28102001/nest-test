import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { PostDto } from './post.dto';

export class PostChannelDto extends PostDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  channelId: string;
}
