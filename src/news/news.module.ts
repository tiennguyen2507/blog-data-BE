import { Module } from '@nestjs/common';
import { NewsService } from './news.service';
import { NewsController } from './news.controller';
import { DatabaseModule } from '../database/database.module';
import { newsProviders } from '../providers/news.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [NewsController],
  providers: [NewsService, ...newsProviders],
})
export class NewsModule {}
