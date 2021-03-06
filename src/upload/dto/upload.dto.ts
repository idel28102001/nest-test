import { ApiProperty } from '@nestjs/swagger';

export class UploadDto {

  @ApiProperty()
  fieldname: string;

  @ApiProperty()
  originalname: string;

  @ApiProperty()
  encoding: string;

  @ApiProperty()
  mimetype: string;

  @ApiProperty()
  buffer: Buffer;

  @ApiProperty()
  size: number;
}
