export class ContentDto {
  fieldname: string;
  source?: string | null;
  originalname: string;
  encoding: string;
  mimetype: string;
  buffer?: Buffer | null;
  size: number;
}
