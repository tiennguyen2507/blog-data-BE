import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';
import { ProjectsModule } from './projects/projects.module';
import { ContactModule } from './contact/contact.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageController } from './image/image.controller';
import { CommentsAboutMeModule } from './comments-about-me/comments-about-me.module';
import { AutoBlogModule } from './auto-blog/auto-blog.module';
import { OrderModule } from './order/order.module';
import { TelegramModule } from './telegram/telegram.module';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    DatabaseModule,
    PostsModule,
    ProjectsModule,
    ContactModule,
    CloudinaryModule,
    CommentsAboutMeModule,
    AutoBlogModule,
    OrderModule,
    TelegramModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService],
})
export class AppModule {}
