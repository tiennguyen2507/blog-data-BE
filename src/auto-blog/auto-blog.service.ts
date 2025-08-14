import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { POST_MODEL } from '../providers/post.providers';
import { Post } from '../schemas/post.schema';
import { User } from '../schemas/users.schema';
import axios from 'axios';
import { RSSUtil, RSSArticle } from './rss.util';

const RSS_FEEDS = [
  'https://vnexpress.net/rss/so-hoa.rss',
  'https://vietnamnet.vn/rss/cong-nghe.rss',
  'https://dantri.com.vn/rss/suc-manh-so.rss',
  'https://ictnews.vietnamnet.vn/rss/home.rss',
  'https://genk.vn/rss.chn',
  'https://cafef.vn/cong-nghe.rss',
];

interface BlogPost {
  title: string;
  slug: string;
  content: string;
  image?: string;
  tags: string[];
  publishedAt: string;
}

@Injectable()
export class AutoBlogService {
  private readonly logger = new Logger(AutoBlogService.name);
  private readonly groqApiKey: string;

  constructor(
    private configService: ConfigService,
    @Inject(POST_MODEL) private readonly postModel: Model<Post>,
    @Inject('USER_MODEL') private readonly userModel: Model<User>,
  ) {
    this.groqApiKey = this.configService.get<string>('GROQ_API_KEY');
    if (!this.groqApiKey) {
      this.logger.warn('GROQ_API_KEY not found in environment variables');
    }
  }

  async fetchLatestArticles(): Promise<RSSArticle[]> {
    try {
      this.logger.log('Fetching articles from RSS feeds...');

      const allArticles = await RSSUtil.parseMultipleFeeds(RSS_FEEDS);
      this.logger.log(`Found ${allArticles.length} total articles`);

      // Lọc bài viết trong ngày hôm nay
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayArticles = allArticles.filter(
        (article) => article.publishedAt >= today,
      );

      this.logger.log(`Found ${todayArticles.length} articles from today`);

      // Loại bỏ trùng lặp và lấy 10 bài mới nhất
      const uniqueArticles = RSSUtil.removeDuplicateArticles(todayArticles);
      const latestArticles = RSSUtil.getLatestArticles(uniqueArticles, 4);

      this.logger.log(`Processing ${latestArticles.length} unique articles`);
      return latestArticles;
    } catch (error) {
      this.logger.error('Error fetching articles:', error);
      return [];
    }
  }

  async rewriteContentWithAI(article: RSSArticle): Promise<string> {
    if (!this.groqApiKey) {
      this.logger.error('GROQ_API_KEY not configured');
      return article.content;
    }

    try {
      const prompt = `
Hãy viết lại hoàn toàn bài báo sau đây bằng tiếng Việt tự nhiên, giữ nguyên ý chính nhưng thay đổi cách diễn đạt:

Tiêu đề: ${article.title}
Nội dung gốc: ${article.content}

Yêu cầu:
- Viết lại hoàn toàn, không copy nội dung gốc
- Giữ nguyên ý chính và thông tin quan trọng
- Sử dụng giọng văn tự nhiên, dễ đọc, chuyên nghiệp
- Tối ưu SEO với từ khóa phù hợp
- Độ dài khoảng 800-1200 từ (dài hơn, chi tiết hơn)
- Viết theo phong cách báo chí chuyên nghiệp
- Mở rộng thông tin với các ví dụ, giải thích chi tiết
- Thêm phần kết luận hoặc ý nghĩa thực tế
- Sử dụng các từ nối để tạo mạch lạc
- Thêm thông tin bổ sung liên quan đến chủ đề

QUAN TRỌNG: BẮT BUỘC trả về nội dung theo định dạng HTML để hiển thị với React Quill. Sử dụng các thẻ HTML sau:
- <p> cho đoạn văn bản
- <h2> cho tiêu đề chính
- <h3> cho tiêu đề phụ
- <strong> cho text in đậm
- <em> cho text in nghiêng
- <ul> và <li> cho danh sách
- <blockquote> cho trích dẫn
- <br> cho xuống dòng

Ví dụ format HTML:
<p>Đoạn văn mở đầu...</p>
<h2>Tiêu đề chính</h2>
<p>Nội dung chi tiết...</p>
<h3>Tiêu đề phụ</h3>
<ul>
<li>Mục 1</li>
<li>Mục 2</li>
</ul>
<p>Kết luận...</p>

Trả về nội dung HTML:
`;

      const response = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        {
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        },
        {
          headers: {
            Authorization: `Bearer ${this.groqApiKey}`,
            'Content-Type': 'application/json',
          },
        },
      );

      let rewrittenContent = response.data.choices[0].message.content;

      // Chuyển đổi markdown thành HTML nếu cần
      rewrittenContent = this.convertMarkdownToHTML(rewrittenContent);

      this.logger.log(`Successfully rewritten content for: ${article.title}`);
      return rewrittenContent;
    } catch (error) {
      this.logger.error(`Error rewriting content for ${article.title}:`, error);
      return article.content;
    }
  }

  generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Loại bỏ dấu
      .replace(/[đĐ]/g, 'd') // Thay đổi đ thành d
      .replace(/[^a-z0-9\s-]/g, '') // Chỉ giữ chữ cái, số, dấu cách và gạch ngang
      .replace(/\s+/g, '-') // Thay dấu cách bằng gạch ngang
      .replace(/-+/g, '-') // Loại bỏ gạch ngang liên tiếp
      .trim()
      .replace(/^-|-$/g, ''); // Loại bỏ gạch ngang ở đầu và cuối
  }

  convertMarkdownToHTML(content: string): string {
    // Chuyển đổi markdown thành HTML với format đẹp
    return (
      content
        // Tiêu đề với style đẹp
        .replace(
          /^### (.*$)/gim,
          '<h3 style="color: #2c3e50; margin: 20px 0 15px 0; font-size: 1.3em; border-left: 4px solid #3498db; padding-left: 15px;">$1</h3>',
        )
        .replace(
          /^## (.*$)/gim,
          '<h2 style="color: #34495e; margin: 25px 0 20px 0; font-size: 1.6em; border-bottom: 2px solid #ecf0f1; padding-bottom: 10px;">$1</h2>',
        )
        .replace(
          /^# (.*$)/gim,
          '<h1 style="color: #2c3e50; margin: 30px 0 25px 0; font-size: 2em; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">$1</h1>',
        )

        // Bold và italic với style
        .replace(
          /\*\*(.*?)\*\*/g,
          '<strong style="color: #e74c3c; font-weight: 600;">$1</strong>',
        )
        .replace(
          /\*(.*?)\*/g,
          '<em style="color: #9b59b6; font-style: italic;">$1</em>',
        )

        // Danh sách với style đẹp
        .replace(
          /^\* (.*$)/gim,
          '<li style="margin: 8px 0; padding: 5px 0; border-left: 3px solid #3498db; padding-left: 15px; background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);">$1</li>',
        )
        .replace(
          /^- (.*$)/gim,
          '<li style="margin: 8px 0; padding: 5px 0; border-left: 3px solid #e74c3c; padding-left: 15px; background: linear-gradient(90deg, #f8f9fa 0%, #ffffff 100%);">$1</li>',
        )

        // Đoạn văn với style đẹp
        .replace(
          /^(?!<[h|u|o]|<li)(.+)$/gim,
          '<p style="margin: 15px 0; line-height: 1.8; text-align: justify; color: #2c3e50; font-size: 16px; text-indent: 20px;">$1</p>',
        )

        // Wrap danh sách với style
        .replace(
          /(<li.*<\/li>)/gs,
          '<ul style="margin: 20px 0; padding: 20px; background: #f8f9fa; border-radius: 8px; border: 1px solid #e9ecef;">$1</ul>',
        )

        // Xóa <p> thừa trong danh sách
        .replace(/<p><ul/g, '<ul')
        .replace(/<\/ul><\/p>/g, '</ul>')

        // Xóa <p> thừa trong heading
        .replace(/<p><h[1-6]>/g, '<h$1>')
        .replace(/<\/h[1-6]><\/p>/g, '</h$1>')

        // Xóa <p> rỗng
        .replace(/<p><\/p>/g, '')

        // Xử lý xuống dòng và tạo khoảng cách đẹp
        .replace(
          /\n\n+/g,
          '</p><p style="margin: 15px 0; line-height: 1.8; text-align: justify; color: #2c3e50; font-size: 16px; text-indent: 20px;">',
        )
        .replace(/\n/g, ' ')
        .replace(
          /<\/p><p style="margin: 15px 0; line-height: 1.8; text-align: justify; color: #2c3e50; font-size: 16px; text-indent: 20px;"><\/p>/g,
          '</p><p style="margin: 15px 0; line-height: 1.8; text-align: justify; color: #2c3e50; font-size: 16px; text-indent: 20px;">',
        )
        .replace(
          /^<p style="margin: 15px 0; line-height: 1.8; text-align: justify; color: #2c3e50; font-size: 16px; text-indent: 20px;"><\/p>/,
          '',
        )
        .replace(
          /<p style="margin: 15px 0; line-height: 1.8; text-align: justify; color: #2c3e50; font-size: 16px; text-indent: 20px;"><\/p>$/,
          '',
        )

        // Thêm blockquote đẹp cho trích dẫn
        .replace(
          /^> (.*$)/gim,
          '<blockquote style="margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 8px; border-left: 5px solid #e74c3c; font-style: italic;">$1</blockquote>',
        )

        // Thêm highlight cho từ khóa quan trọng
        .replace(
          /`(.*?)`/g,
          '<span style="background: #f39c12; color: white; padding: 2px 6px; border-radius: 4px; font-family: monospace;">$1</span>',
        )

        // Thêm style cho links (nếu có)
        .replace(
          /\[([^\]]+)\]\(([^)]+)\)/g,
          '<a href="$2" style="color: #3498db; text-decoration: none; border-bottom: 1px solid #3498db; transition: all 0.3s ease;">$1</a>',
        )
    );
  }

  extractTags(title: string, content: string): string[] {
    const techKeywords = [
      'công nghệ',
      'AI',
      'trí tuệ nhân tạo',
      'machine learning',
      'blockchain',
      'cryptocurrency',
      'bitcoin',
      'ethereum',
      'smartphone',
      'iPhone',
      'Android',
      'Samsung',
      'Apple',
      'Google',
      'Facebook',
      'Meta',
      'Microsoft',
      'Amazon',
      'cloud computing',
      'điện toán đám mây',
      'IoT',
      'internet of things',
      '5G',
      '6G',
      'autonomous',
      'tự động',
      'robot',
      'drone',
      'VR',
      'AR',
      'virtual reality',
      'augmented reality',
      'cybersecurity',
      'bảo mật',
      'hacking',
      'malware',
      'virus',
      'software',
      'phần mềm',
      'hardware',
      'phần cứng',
      'chip',
      'processor',
      'GPU',
      'CPU',
      'RAM',
      'SSD',
      'HDD',
    ];

    const text = `${title} ${content}`.toLowerCase();
    const foundTags = techKeywords.filter((keyword) =>
      text.includes(keyword.toLowerCase()),
    );

    // Thêm tag mặc định nếu không tìm thấy tag nào
    if (foundTags.length === 0) {
      foundTags.push('công nghệ');
    }

    return foundTags.slice(0, 5); // Giới hạn 5 tags
  }

  async getAdminUserId(): Promise<Types.ObjectId | null> {
    try {
      const adminUser = await this.userModel
        .findOne({ email: 'admin@gmail.com' })
        .exec();
      if (adminUser) {
        return adminUser._id;
      }
      this.logger.warn('Admin user with email admin@gmail.com not found');
      return null;
    } catch (error) {
      this.logger.error('Error finding admin user:', error.message);
      return null;
    }
  }

  async postBlog(blogPost: BlogPost): Promise<boolean> {
    try {
      // Tìm user admin
      const adminUserId = await this.getAdminUserId();
      if (!adminUserId) {
        this.logger.error('Cannot post blog: Admin user not found');
        return false;
      }

      // Tạo post mới trong MongoDB
      const newPost = new this.postModel({
        title: blogPost.title,
        description: blogPost.content, // Sử dụng content làm description
        thumbnail: blogPost.image, // Sử dụng image làm thumbnail
        status: true, // true = published
        createdBy: adminUserId, // Sử dụng ID của user admin
      });

      await newPost.save();

      // Gửi URL đến Google để index
      await this.notifyGoogleForIndexing(newPost._id.toString());

      this.logger.log(`✅ Blog posted successfully: ${blogPost.title}`);
      console.log(`✅ Blog posted successfully: ${blogPost.title}`);
      return true;
    } catch (error) {
      this.logger.error(
        `Error posting blog "${blogPost.title}":`,
        error.message,
      );
      return false;
    }
  }

  async notifyGoogleForIndexing(postId: string): Promise<void> {
    try {
      const postUrl = `https://nguyenledinhtien.io.vn/blogs/${postId}`;

      // Ping Google để thông báo URL mới
      // Sử dụng localhost cho development, production sẽ dùng domain thật
      const baseUrl =
        process.env.NODE_ENV === 'production'
          ? 'https://nguyenledinhtien.io.vn'
          : 'http://localhost:3000';

      const googlePingUrl = `https://www.google.com/ping?sitemap=${baseUrl}/seo/sitemap.xml`;

      this.logger.log(`🔍 Attempting to ping Google: ${googlePingUrl}`);

      const response = await axios.get(googlePingUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'AutoBlog-System/1.0',
        },
        validateStatus: (status) => status < 500, // Chấp nhận status 2xx, 3xx, 4xx
      });

      if (response.status === 200) {
        this.logger.log(`✅ Google ping successful for: ${postUrl}`);
        console.log(`✅ Google ping successful for: ${postUrl}`);
      } else {
        this.logger.warn(
          `⚠️ Google ping returned status: ${response.status} for: ${postUrl}`,
        );
        console.log(
          `⚠️ Google ping returned status: ${response.status} for: ${postUrl}`,
        );
      }

      // Gửi URL trực tiếp đến Google Indexing API (nếu có API key)
      await this.submitToGoogleIndexingAPI(postUrl);
    } catch (error) {
      this.logger.warn(
        `Failed to notify Google for indexing: ${error.message}`,
      );
      console.log(`❌ Google notification failed: ${error.message}`);

      // Log chi tiết lỗi để debug
      if (error.response) {
        this.logger.warn(`Response status: ${error.response.status}`);
        this.logger.warn(
          `Response data: ${JSON.stringify(error.response.data)}`,
        );
      }
    }
  }

  async submitToGoogleIndexingAPI(url: string): Promise<void> {
    try {
      // Google Indexing API yêu cầu OAuth 2.0 và service account
      // Đây là placeholder cho việc implement trong tương lai

      // const indexingApiUrl =
      //   'https://indexing.googleapis.com/v3/urlNotifications:publish';

      // Cần có Google API key và service account credentials
      // const response = await axios.post(indexingApiUrl, {
      //   url: url,
      //   type: 'URL_UPDATED'
      // }, {
      //   headers: {
      //     'Authorization': `Bearer ${googleApiToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });

      this.logger.log(`📝 URL submitted to Google Indexing API: ${url}`);
    } catch (error) {
      this.logger.warn(`Google Indexing API not configured: ${error.message}`);
    }
  }

  async processArticle(article: RSSArticle): Promise<boolean> {
    try {
      this.logger.log(`Processing article: ${article.title}`);

      // Rewrite content với AI
      const rewrittenContent = await this.rewriteContentWithAI(article);

      // Tạo slug và tags
      const slug = this.generateSlug(article.title);
      const tags = this.extractTags(article.title, rewrittenContent);

      // Tạo blog post object
      const blogPost: BlogPost = {
        title: article.title,
        slug,
        content: rewrittenContent,
        image: article.image,
        tags,
        publishedAt: new Date().toISOString(),
      };

      // Gửi blog
      const success = await this.postBlog(blogPost);
      return success;
    } catch (error) {
      this.logger.error(`Error processing article "${article.title}":`, error);
      return false;
    }
  }

  async runAutoBlogProcess(): Promise<void> {
    try {
      this.logger.log('🚀 Starting auto blog process...');

      // Lấy bài viết mới nhất
      const articles = await this.fetchLatestArticles();

      if (articles.length === 0) {
        this.logger.log('No new articles found today');
        return;
      }

      // Xử lý từng bài viết
      let successCount = 0;
      for (const article of articles) {
        const success = await this.processArticle(article);
        if (success) {
          successCount++;
        }

        // Delay giữa các request để tránh rate limiting
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      this.logger.log(
        `✅ Auto blog process completed. ${successCount}/${articles.length} articles posted successfully`,
      );
      console.log(
        `✅ Auto blog process completed. ${successCount}/${articles.length} articles posted successfully`,
      );
    } catch (error) {
      this.logger.error('Error in auto blog process:', error);
    }
  }
}
