import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { DatabaseModule } from '../database/database.module';
import { postProviders } from '../providers/post.providers';
import { usersProviders } from '../providers/user.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [PostsController],
  providers: [PostsService, ...postProviders, ...usersProviders],
})
export class PostsModule {}
