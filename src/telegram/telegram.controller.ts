import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';

@ApiTags('Telegram Test')
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('test')
  @ApiOperation({ summary: 'Test Telegram bot connection' })
  @ApiResponse({ status: 200, description: 'Test message sent successfully' })
  async testBot() {
    let message = `🧪 <b>TEST TELEGRAM BOT</b>\n\n`;
    message += `✅ Bot đang hoạt động bình thường!\n`;
    message += `⏰ Thời gian test: ${new Date().toLocaleString('vi-VN')}\n`;
    message += `🚀 Sẵn sàng nhận thông báo đơn hàng!`;

    const result = await this.telegramService.sendMessage(message);

    return {
      success: result,
      message: result ? 'Test message sent successfully' : 'Failed to send test message',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('debug')
  @ApiOperation({ summary: 'Debug Telegram configuration' })
  @ApiResponse({ status: 200, description: 'Configuration debug info' })
  async debugConfig() {
    // Kiểm tra cấu hình mà không gửi tin nhắn
    return {
      message: 'Check server logs for Telegram configuration debug info',
      timestamp: new Date().toISOString(),
      instruction: 'Call this endpoint and check server console for debug logs',
    };
  }

  @Post('test-order')
  @ApiOperation({ summary: 'Test order notification' })
  @ApiResponse({ status: 200, description: 'Test order notification sent successfully' })
  async testOrderNotification() {
    // Mock order data để test
    const mockOrder = {
      _id: 'test_order_123',
      fullName: 'Nguyễn Văn Test',
      phone: '0987654321',
      address: '123 Đường Test, Quận Test, TP Test',
      note: 'Đây là đơn hàng test',
      totalAmount: 150000,
      status: 'pending',
      orderItems: [
        {
          productId: {
            title: 'Bánh Chocolate Test',
            price: 75000,
          },
          quantity: 2,
        },
      ],
      createdAt: new Date(),
    };

    const result = await this.telegramService.sendOrderNotification(mockOrder);

    return {
      success: result,
      message: result
        ? 'Test order notification sent successfully'
        : 'Failed to send test order notification',
      mockOrder,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('test-status-update')
  @ApiOperation({ summary: 'Test status update notification' })
  @ApiResponse({ status: 200, description: 'Test status update notification sent successfully' })
  async testStatusUpdateNotification() {
    const result = await this.telegramService.sendOrderStatusUpdate(
      'test_order_123',
      'pending',
      'confirmed',
    );

    return {
      success: result,
      message: result
        ? 'Test status update notification sent successfully'
        : 'Failed to send test status update notification',
      timestamp: new Date().toISOString(),
    };
  }
}
