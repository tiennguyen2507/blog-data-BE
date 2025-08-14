import { Controller, Get, Post, Param, Logger, Res } from '@nestjs/common';
import { Response } from 'express';
import { AutoBlogService } from './auto-blog.service';
import { SitemapService } from './sitemap.service';

@Controller('seo')
export class SEOController {
  private readonly logger = new Logger(SEOController.name);

  constructor(
    private readonly autoBlogService: AutoBlogService,
    private readonly sitemapService: SitemapService,
  ) {}

  @Get('sitemap.xml')
  async generateSitemap(@Res() res: Response) {
    try {
      const sitemap = await this.sitemapService.generateSitemapXML();

      res.set({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600', // Cache 1 giờ
      });

      res.send(sitemap);
    } catch (error) {
      this.logger.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  }

  @Post('notify-google/:postId')
  async notifyGoogleForPost(@Param('postId') postId: string) {
    try {
      await this.autoBlogService.notifyGoogleForIndexing(postId);
      return {
        success: true,
        message: `Google notified for post ID: ${postId}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error notifying Google for post ${postId}:`, error);
      return {
        success: false,
        message: 'Failed to notify Google',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('robots.txt')
  async generateRobotsTxt() {
    const robotsTxt = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://nguyenledinhtien.io.vn/seo/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin areas
Disallow: /admin/
Disallow: /api/auth/
Disallow: /api/users/`;

    return robotsTxt;
  }
}
