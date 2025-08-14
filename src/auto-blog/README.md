# Auto Blog Module

Module tự động lấy tin tức công nghệ từ RSS feeds và tạo bài viết blog mới.

## Tính năng

- Lấy tin tức từ 6 RSS feeds tiếng Việt về công nghệ
- Loại bỏ bài viết trùng lặp
- Rewrite nội dung bằng AI (Groq API)
- Tự động tạo slug và tags
- Gửi bài viết đến blog API
- Cron job chạy hàng ngày lúc 8h sáng

## RSS Feeds

- VnExpress Số hóa
- VietnamNet Công nghệ
- Dân trí Sức mạnh số
- ICT News
- GenK
- Cafef Công nghệ

## Cấu hình

### 1. Thêm biến môi trường

Tạo file `.env` và thêm:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 2. API Endpoint

Blog sẽ được gửi đến:

```
POST https://nguyenledinhtien.io.vn/api/blogs
```

## Sử dụng

### Cron Job tự động

Hệ thống sẽ tự động chạy mỗi ngày lúc 8h sáng (Asia/Ho_Chi_Minh).

### Test thủ công

```bash
# Chạy auto blog process
POST /auto-blog/run

# Kiểm tra trạng thái
GET /auto-blog/status
```

## Cấu trúc dữ liệu

### Blog Post

```json
{
  "title": "Tiêu đề bài viết",
  "slug": "tieu-de-bai-viet",
  "content": "Nội dung đã được rewrite",
  "image": "URL ảnh",
  "tags": ["công nghệ", "AI"],
  "publishedAt": "2024-01-01T08:00:00.000Z"
}
```

## Logs

Hệ thống sẽ log ra console khi:

- ✅ Blog posted successfully: [tiêu đề]
- ✅ Auto blog process completed. X/Y articles posted successfully

## Lưu ý

- Cần có Groq API key để rewrite nội dung
- Hệ thống có delay 2 giây giữa các request để tránh rate limiting
- Chỉ xử lý bài viết trong ngày hôm nay
- Tối đa 10 bài viết mỗi lần chạy
