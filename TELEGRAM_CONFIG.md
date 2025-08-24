# 🔧 Cấu hình Telegram Bot

## 📝 Tạo file .env

Tạo file `.env` trong thư mục gốc của project với nội dung:

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database

# JWT Configuration
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=8328223259:AAGFSBcbLnBMV0GIbUtH0C6dw9OIgcDznbg
TELEGRAM_CHAT_ID=your_chat_id_here

# Server Configuration
PORT=3000
NODE_ENV=development
```

## 🎯 Thay thế các giá trị:

- `your_database` → Tên database của bạn
- `your_jwt_secret_here` → Secret key cho JWT
- `your_cloud_name` → Cloudinary cloud name
- `your_api_key` → Cloudinary API key
- `your_api_secret` → Cloudinary API secret
- `your_chat_id_here` → Chat ID từ Telegram (cần lấy)

## 🚨 Quan trọng:

1. **KHÔNG commit file .env vào git**
2. **Thêm .env vào .gitignore**
3. **Restart server** sau khi tạo file .env
4. **Kiểm tra console logs** để debug

## 🧪 Test sau khi cấu hình:

1. **Restart server**
2. **Gọi endpoint debug:** `GET /telegram/debug`
3. **Kiểm tra console logs** để xem cấu hình
4. **Test gửi tin nhắn:** `GET /telegram/test`
