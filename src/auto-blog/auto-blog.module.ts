import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '../database/database.module';
import { postProviders } from '../providers/post.providers';
import { usersProviders } from '../providers/user.providers';
import { AutoBlogService } from './auto-blog.service';
import { AutoBlogCron } from './auto-blog.cron';
import { AutoBlogController } from './auto-blog.controller';
import { SEOController } from './seo.controller';
import { SitemapService } from './sitemap.service';

@Module({
  imports: [ScheduleModule.forRoot(), ConfigModule, DatabaseModule],
  controllers: [AutoBlogController, SEOController],
  providers: [AutoBlogService, AutoBlogCron, SitemapService, ...postProviders, ...usersProviders],
  exports: [AutoBlogService],
})
export class AutoBlogModule {}
