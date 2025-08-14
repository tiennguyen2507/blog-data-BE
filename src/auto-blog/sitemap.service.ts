import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { POST_MODEL } from '../providers/post.providers';
import { Post } from '../schemas/post.schema';

@Injectable()
export class SitemapService {
  constructor(@Inject(POST_MODEL) private readonly postModel: Model<Post>) {}

  async generateSitemapXML(): Promise<string> {
    try {
      // Lấy tất cả bài viết đã publish
      const posts = await this.postModel
        .find({ status: true })
        .sort({ createdAt: -1 })
        .limit(1000) // Giới hạn 1000 bài viết mới nhất
        .lean()
        .exec();

      // Tạo sitemap XML
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nguyenledinhtien.io.vn/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nguyenledinhtien.io.vn/posts</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

      // Thêm tất cả bài viết vào sitemap
      for (const post of posts) {
        const postUrl = `https://nguyenledinhtien.io.vn/posts/${post._id}`;
        const lastmod = post.updatedAt || post.createdAt || new Date();

        sitemap += `
  <url>
    <loc>${postUrl}</loc>
    <lastmod>${lastmod.toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }

      sitemap += `
</urlset>`;

      return sitemap;
    } catch (error) {
      throw new Error(`Error generating sitemap: ${error.message}`);
    }
  }

  async getSitemapUrls(): Promise<string[]> {
    try {
      const posts = await this.postModel.find({ status: true }).select('_id').lean().exec();

      const urls = ['https://nguyenledinhtien.io.vn/', 'https://nguyenledinhtien.io.vn/posts'];

      // Thêm URL của tất cả bài viết
      for (const post of posts) {
        urls.push(`https://nguyenledinhtien.io.vn/posts/${post._id}`);
      }

      return urls;
    } catch (error) {
      throw new Error(`Error getting sitemap URLs: ${error.message}`);
    }
  }
}
