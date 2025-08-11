import { Module } from '@nestjs/common';
import { CommentsAboutMeService } from './comments-about-me.service';
import { CommentsAboutMeController } from './comments-about-me.controller';
import { commentsAboutMeProviders } from '../providers/comments-about-me.providers';

@Module({
  controllers: [CommentsAboutMeController],
  providers: [CommentsAboutMeService, ...commentsAboutMeProviders],
})
export class CommentsAboutMeModule {}
