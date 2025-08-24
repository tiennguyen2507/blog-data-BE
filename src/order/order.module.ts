import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { DatabaseModule } from 'src/database/database.module';
import { orderProviders } from 'src/providers/order.providers';
import { productsProviders } from 'src/providers/products.providers';
import { TelegramModule } from '../telegram/telegram.module';

@Module({
  imports: [DatabaseModule, TelegramModule],
  controllers: [OrderController],
  providers: [OrderService, ...orderProviders, ...productsProviders],
  exports: [OrderService],
})
export class OrderModule {}
