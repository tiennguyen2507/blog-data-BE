import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AutoBlogService } from './auto-blog.service';

@Injectable()
export class AutoBlogCron {
  private readonly logger = new Logger(AutoBlogCron.name);

  constructor(private readonly autoBlogService: AutoBlogService) {}

  @Cron('0 8 * * *', {
    name: 'auto-blog-daily',
    timeZone: 'Asia/Ho_Chi_Minh',
  })
  async handleDailyAutoBlog() {
    this.logger.log('🕐 Daily auto blog cron job triggered at 8:00 AM');
    console.log('🕐 Daily auto blog cron job triggered at 8:00 AM');

    try {
      await this.autoBlogService.runAutoBlogProcess();
    } catch (error) {
      this.logger.error('Error in daily auto blog cron job:', error);
    }
  }

  // Cron job để test (chạy mỗi phút) - chỉ sử dụng trong development
  // @Cron('* * * * *', {
  //   name: 'auto-blog-test',
  //   timeZone: 'Asia/Ho_Chi_Minh',
  // })
  // async handleTestAutoBlog() {
  //   this.logger.log('🧪 Test auto blog cron job triggered');
  //   try {
  //     await this.autoBlogService.runAutoBlogProcess();
  //   } catch (error) {
  //     this.logger.error('Error in test auto blog cron job:', error);
  //   }
  // }
}
