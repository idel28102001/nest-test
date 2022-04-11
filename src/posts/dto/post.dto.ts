import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class PostDto {
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
