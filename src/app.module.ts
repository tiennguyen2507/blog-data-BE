import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { DataMaterModule } from './data-mater/data-mater.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    DatabaseModule,
    UsersModule,
    AuthModule,
    DataMaterModule,
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
