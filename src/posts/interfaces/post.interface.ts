import { ContentDto } from '../dto/content.dto';

export interface postInterface {
  title: string;
  announcement: string;
  description: string;
  content: ContentDto[];
}
