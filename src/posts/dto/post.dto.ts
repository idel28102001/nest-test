import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class PostDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsUUID()
  channelId: string;

  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(30)
  announcement: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(150)
  description: string;

  
}
