import * as Parser from 'rss-parser';

export interface RSSArticle {
  title: string;
  link: string;
  content: string;
  image?: string;
  publishedAt: Date;
  source: string;
}

export class RSSUtil {
  private static parser = new Parser({
    customFields: {
      item: [
        ['media:content', 'mediaContent'],
        ['enclosure', 'enclosure'],
        ['image', 'image'],
      ],
    },
  });

  static async parseRSSFeed(feedUrl: string): Promise<RSSArticle[]> {
    try {
      const feed = await this.parser.parseURL(feedUrl);
      const articles: RSSArticle[] = [];

      for (const item of feed.items) {
        // Lấy ảnh từ các trường khác nhau
        let imageUrl: string | undefined;

        if (item.enclosure?.url) {
          imageUrl = item.enclosure.url;
        } else if (item['mediaContent']?.[0]?.['$']?.url) {
          imageUrl = item['mediaContent'][0]['$'].url;
        } else if (item.image?.url) {
          imageUrl = item.image.url;
        }

        // Tìm ảnh trong content nếu không có ảnh riêng
        if (!imageUrl && item.content) {
          const imgMatch = item.content.match(/<img[^>]+src="([^"]+)"/);
          if (imgMatch) {
            imageUrl = imgMatch[1];
          }
        }

        const article: RSSArticle = {
          title: item.title || '',
          link: item.link || '',
          content: item.contentSnippet || item.content || '',
          image: imageUrl,
          publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
          source: feed.title || new URL(feedUrl).hostname,
        };

        articles.push(article);
      }

      return articles;
    } catch (error) {
      console.error(`Error parsing RSS feed ${feedUrl}:`, error);
      return [];
    }
  }

  static async parseMultipleFeeds(feedUrls: string[]): Promise<RSSArticle[]> {
    const allArticles: RSSArticle[] = [];

    for (const feedUrl of feedUrls) {
      try {
        const articles = await this.parseRSSFeed(feedUrl);
        allArticles.push(...articles);
      } catch (error) {
        console.error(`Failed to parse feed ${feedUrl}:`, error);
      }
    }

    return allArticles;
  }

  static removeDuplicateArticles(articles: RSSArticle[]): RSSArticle[] {
    const seen = new Set<string>();
    return articles.filter((article) => {
      const normalizedTitle = article.title.toLowerCase().trim();
      if (seen.has(normalizedTitle)) {
        return false;
      }
      seen.add(normalizedTitle);
      return true;
    });
  }

  static getLatestArticles(
    articles: RSSArticle[],
    limit: number = 10,
  ): RSSArticle[] {
    return articles
      .sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      .slice(0, limit);
  }
}
