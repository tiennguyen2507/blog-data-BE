# Auto Blog System - Hướng dẫn cài đặt và sử dụng

## 🚀 Tổng quan

Hệ thống tự động lấy tin tức công nghệ từ RSS feeds, rewrite nội dung bằng AI và đăng bài lên blog.

## 📋 Yêu cầu hệ thống

- Node.js 16+
- NestJS framework
- Groq API key
- Blog API endpoint

## 🔧 Cài đặt

### 1. Cài đặt dependencies

```bash
npm install @nestjs/schedule rss-parser axios
```

### 2. Cấu hình biến môi trường

Tạo file `.env` trong thư mục gốc:

```env
# Groq API Configuration
GROQ_API_KEY=your_groq_api_key_here

# Các biến môi trường khác (nếu có)
MONGODB_URI=mongodb://localhost:27017/your_database
JWT_SECRET=your_jwt_secret
```

### 3. Lấy Groq API Key

1. Đăng ký tài khoản tại [Groq](https://console.groq.com/)
2. Tạo API key mới
3. Thêm vào file `.env`

## 🏗️ Cấu trúc module

```
src/auto-blog/
├── auto-blog.module.ts      # Module chính
├── auto-blog.service.ts     # Logic xử lý chính
├── auto-blog.cron.ts        # Cron job scheduler
├── auto-blog.controller.ts  # API endpoints
├── rss.util.ts             # Utility functions
└── README.md               # Hướng dẫn chi tiết
```

## 🎯 Tính năng

### RSS Feeds được hỗ trợ

- VnExpress Số hóa: `https://vnexpress.net/rss/so-hoa.rss`
- VietnamNet Công nghệ: `https://vietnamnet.vn/rss/cong-nghe.rss`
- Dân trí Sức mạnh số: `https://dantri.com.vn/rss/suc-manh-so.rss`
- ICT News: `https://ictnews.vietnamnet.vn/rss/home.rss`
- GenK: `https://genk.vn/rss.chn`
- Cafef Công nghệ: `https://cafef.vn/cong-nghe.rss`

### Quy trình xử lý

1. **Lấy RSS feeds** - Parse tất cả RSS feeds
2. **Lọc bài viết** - Chỉ lấy bài viết trong ngày hôm nay
3. **Loại bỏ trùng lặp** - Dựa trên tiêu đề
4. **Giới hạn số lượng** - Tối đa 10 bài viết
5. **Rewrite nội dung** - Sử dụng Groq AI
6. **Tạo metadata** - Slug, tags, publishedAt
7. **Gửi bài viết** - POST đến blog API

## ⏰ Cron Job

Hệ thống tự động chạy mỗi ngày lúc 8:00 AM (Asia/Ho_Chi_Minh):

```typescript
@Cron('0 8 * * *', {
  name: 'auto-blog-daily',
  timeZone: 'Asia/Ho_Chi_Minh',
})
```

## 🧪 Test thủ công

### 1. Chạy auto blog process

```bash
curl -X POST http://localhost:3000/auto-blog/run
```

### 2. Kiểm tra trạng thái

```bash
curl http://localhost:3000/auto-blog/status
```

### 3. Test RSS feeds

```bash
# Test một RSS feed cụ thể
curl https://vnexpress.net/rss/so-hoa.rss
```

## 📊 API Endpoints

### POST /auto-blog/run

Chạy auto blog process thủ công

**Response:**

```json
{
  "success": true,
  "message": "Auto blog process completed successfully",
  "timestamp": "2024-01-01T08:00:00.000Z"
}
```

### GET /auto-blog/status

Kiểm tra trạng thái hệ thống

**Response:**

```json
{
  "status": "running",
  "lastRun": "2024-01-01T08:00:00.000Z",
  "nextScheduledRun": "8:00 AM daily (Asia/Ho_Chi_Minh)",
  "cronExpression": "0 8 * * *"
}
```

## 📝 Cấu trúc dữ liệu

### Blog Post Object

```json
{
  "title": "Tiêu đề bài viết",
  "slug": "tieu-de-bai-viet",
  "content": "Nội dung đã được rewrite bằng AI",
  "image": "https://example.com/image.jpg",
  "tags": ["công nghệ", "AI", "smartphone"],
  "publishedAt": "2024-01-01T08:00:00.000Z"
}
```

## 🔍 Logs và Monitoring

### Console Logs

Hệ thống sẽ log ra console:

```
🕐 Daily auto blog cron job triggered at 8:00 AM
🚀 Starting auto blog process...
📡 Fetching articles from RSS feeds...
✅ Found 25 total articles
✅ Found 8 articles from today
✅ Processing 8 unique articles
✅ Successfully rewritten content for: [tiêu đề]
✅ Blog posted successfully: [tiêu đề]
✅ Auto blog process completed. 5/8 articles posted successfully
```

### Error Handling

- RSS feed không khả dụng
- Groq API lỗi
- Blog API endpoint không phản hồi
- Rate limiting

## ⚙️ Tùy chỉnh

### Thay đổi RSS feeds

Chỉnh sửa trong `auto-blog.service.ts`:

```typescript
const RSS_FEEDS = [
  'https://your-feed-1.rss',
  'https://your-feed-2.rss',
  // Thêm feeds mới
];
```

### Thay đổi cron schedule

Chỉnh sửa trong `auto-blog.cron.ts`:

```typescript
@Cron('0 12 * * *', { // Chạy lúc 12h trưa
  name: 'auto-blog-daily',
  timeZone: 'Asia/Ho_Chi_Minh',
})
```

### Thay đổi blog API endpoint

Chỉnh sửa trong `auto-blog.service.ts`:

```typescript
private readonly blogApiUrl = 'https://your-blog-api.com/api/blogs';
```

## 🚨 Troubleshooting

### Lỗi thường gặp

1. **GROQ_API_KEY not found**

   - Kiểm tra file `.env`
   - Đảm bảo biến môi trường được load

2. **RSS feed không khả dụng**

   - Kiểm tra URL RSS feed
   - Kiểm tra kết nối internet

3. **Blog API lỗi**
   - Kiểm tra endpoint URL
   - Kiểm tra authentication (nếu có)

### Debug mode

Thêm log chi tiết trong `auto-blog.service.ts`:

```typescript
this.logger.debug('Processing article:', article);
```

## 📈 Performance

- **Timeout**: 30 giây cho mỗi API call
- **Delay**: 2 giây giữa các request
- **Rate limiting**: Tự động xử lý
- **Error retry**: Không retry tự động

## 🔒 Security

- API keys được lưu trong environment variables
- Không log sensitive data
- Timeout cho tất cả external requests
- Error handling cho tất cả async operations

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:

1. Console logs
2. Network connectivity
3. API key validity
4. RSS feed availability
5. Blog API endpoint status
