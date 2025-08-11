import { PartialType } from '@nestjs/swagger';
import { CreateCommentsAboutMeDto } from './create-comments-about-me.dto';

export class UpdateCommentsAboutMeDto extends PartialType(
  CreateCommentsAboutMeDto,
) {}
