# 🚀 Hướng dẫn setup Telegram Bot để nhận thông báo đơn hàng

## 1. Tạo Telegram Bot

### Bước 1: Tìm BotFather

1. Mở Telegram
2. Tìm kiếm `@BotFather`
3. Gửi lệnh `/start`

### Bước 2: Tạo bot mới

1. Gửi lệnh `/newbot`
2. Nhập tên bot (ví dụ: "Order Notification Bot")
3. Nhập username cho bot (phải kết thúc bằng `bot`, ví dụ: `myorderbot`)
4. BotFather sẽ trả về **Bot Token**

### Bước 3: Lấy Chat ID

1. Thêm bot vào group hoặc chat riêng
2. Gửi một tin nhắn bất kỳ
3. Truy cập: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
4. Tìm `chat.id` trong response

## 2. Cấu hình Environment Variables

Thêm vào file `.env`:

```env
# Telegram Bot Configuration
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

## 3. Ví dụ Bot Token và Chat ID

```env
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789
```

## 4. Test Bot

Sau khi setup, bot sẽ tự động gửi thông báo khi:

- ✅ Có đơn hàng mới
- ✅ Cập nhật trạng thái đơn hàng

## 5. Tính năng thông báo

### Thông báo đơn hàng mới:

- 🛒 Thông tin khách hàng
- 📱 Số điện thoại
- 📍 Địa chỉ giao hàng
- 💰 Tổng tiền
- 🛍️ Chi tiết sản phẩm
- ⏰ Thời gian đặt hàng

### Thông báo cập nhật trạng thái:

- 🔄 Thay đổi trạng thái
- 📊 Trạng thái cũ và mới
- ⏰ Thời gian cập nhật

## 6. Troubleshooting

### Bot không gửi được tin nhắn:

1. Kiểm tra Bot Token có đúng không
2. Kiểm tra Chat ID có đúng không
3. Đảm bảo bot đã được thêm vào chat/group
4. Kiểm tra bot có quyền gửi tin nhắn không

### Lỗi thường gặp:

- `Unauthorized`: Bot Token sai
- `Chat not found`: Chat ID sai
- `Forbidden`: Bot bị chặn

## 7. Bảo mật

- ⚠️ **KHÔNG** chia sẻ Bot Token với ai
- ⚠️ **KHÔNG** commit Bot Token vào git
- ✅ Sử dụng file `.env` và thêm vào `.gitignore`
- ✅ Chỉ sử dụng bot trong môi trường an toàn
