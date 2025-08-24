import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly botToken: string;
  private readonly chatId: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    this.chatId = this.configService.get<string>('TELEGRAM_CHAT_ID');
  }

  async sendMessage(message: string): Promise<boolean> {
    try {
      // Debug logging
      this.logger.log(`Bot Token: ${this.botToken ? 'Configured' : 'NOT CONFIGURED'}`);
      this.logger.log(`Chat ID: ${this.chatId ? 'Configured' : 'NOT CONFIGURED'}`);

      if (!this.botToken || !this.chatId) {
        this.logger.warn('Telegram bot token or chat ID not configured');
        this.logger.warn(`Bot Token: ${this.botToken}`);
        this.logger.warn(`Chat ID: ${this.chatId}`);
        return false;
      }

      const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
      this.logger.log(`Sending message to: ${url}`);
      this.logger.log(`Chat ID: ${this.chatId}`);
      this.logger.log(`Message: ${message}`);

      const response = await axios.post(url, {
        chat_id: this.chatId,
        text: message,
        parse_mode: 'HTML',
      });

      this.logger.log(`Telegram API Response:`, response.data);

      if (response.data.ok) {
        this.logger.log('Telegram message sent successfully');
        return true;
      } else {
        this.logger.error('Failed to send Telegram message:', response.data);
        return false;
      }
    } catch (error) {
      this.logger.error('Error sending Telegram message:', error.message);
      if (error.response) {
        this.logger.error('Error response:', error.response.data);
      }
      return false;
    }
  }

  async sendOrderNotification(orderData: any): Promise<boolean> {
    const message = this.formatOrderMessage(orderData);
    return this.sendMessage(message);
  }

  private formatOrderMessage(orderData: any): string {
    const order = orderData;
    const items = order.orderItems || [];

    let message = `🛒 <b>ĐƠN HÀNG MỚI!</b>\n\n`;
    message += `👤 <b>Khách hàng:</b> ${order.fullName}\n`;
    message += `📱 <b>Số điện thoại:</b> ${order.phone}\n`;
    message += `📍 <b>Địa chỉ:</b> ${order.address}\n`;

    if (order.note) {
      message += `📝 <b>Ghi chú:</b> ${order.note}\n`;
    }

    message += `💰 <b>Tổng tiền:</b> ${order.totalAmount?.toLocaleString('vi-VN')} VNĐ\n`;
    message += `📊 <b>Trạng thái:</b> ${order.status}\n\n`;

    message += `🛍️ <b>Chi tiết đơn hàng:</b>\n`;
    items.forEach((item: any, index: number) => {
      if (item.productId && typeof item.productId === 'object') {
        // Nếu đã populate
        message += `${index + 1}. ${item.productId.title} - Số lượng: ${item.quantity}\n`;
      } else {
        // Nếu chưa populate
        message += `${index + 1}. Sản phẩm ID: ${item.productId} - Số lượng: ${item.quantity}\n`;
      }
    });

    message += `\n⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}\n`;
    message += `🆔 <b>Mã đơn hàng:</b> ${order._id}`;

    return message;
  }

  async sendOrderStatusUpdate(
    orderId: string,
    oldStatus: string,
    newStatus: string,
  ): Promise<boolean> {
    let message = `🧪 <b>CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG</b>\n\n`;
    message += `🆔 <b>Mã đơn hàng:</b> ${orderId}\n`;
    message += `📊 <b>Trạng thái cũ:</b> ${oldStatus}\n`;
    message += `📊 <b>Trạng thái mới:</b> ${newStatus}\n`;
    message += `⏰ <b>Thời gian:</b> ${new Date().toLocaleString('vi-VN')}`;

    return this.sendMessage(message);
  }
}
