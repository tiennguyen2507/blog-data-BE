import { Controller, Post, Get, Logger } from '@nestjs/common';
import { AutoBlogService } from './auto-blog.service';

@Controller('auto-blog')
export class AutoBlogController {
  private readonly logger = new Logger(AutoBlogController.name);

  constructor(private readonly autoBlogService: AutoBlogService) {}

  @Post('run')
  async runAutoBlog() {
    this.logger.log('Manual auto blog trigger requested');
    console.log('🚀 Manual auto blog trigger requested');

    try {
      await this.autoBlogService.runAutoBlogProcess();
      return {
        success: true,
        message: 'Auto blog process completed successfully',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error in manual auto blog trigger:', error);
      return {
        success: false,
        message: 'Auto blog process failed',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('status')
  async getStatus() {
    return {
      status: 'running',
      lastRun: new Date().toISOString(),
      nextScheduledRun: '8:00 AM daily (Asia/Ho_Chi_Minh)',
      cronExpression: '0 8 * * *',
    };
  }
}
