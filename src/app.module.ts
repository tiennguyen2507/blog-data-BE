import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DataMaterModule } from './data-mater/data-mater.module';
import { ProductsModule } from './products/products.module';
import { GateModule } from './gatewaySocket/gatewaySocket.module';
import { MyGateway } from './gatewaySocket/gateway';
import { DatabaseModule } from './database/database.module';
import { ApiCommonModule } from './api-common/api-common.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DataMaterModule,
    ProductsModule,
    GateModule,
    DatabaseModule,
    ApiCommonModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService, MyGateway],
})
export class AppModule {}
