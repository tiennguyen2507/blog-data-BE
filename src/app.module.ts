import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { PostsModule } from './posts/posts.module';
import { ContactModule } from './contact/contact.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { ImageController } from './image/image.controller';
import { CommentsAboutMeModule } from './comments-about-me/comments-about-me.module';
import { AutoBlogModule } from './auto-blog/auto-blog.module';
@Module({
  imports: [
    UsersModule,
    AuthModule,
    ProductsModule,
    DatabaseModule,
    PostsModule,
    ContactModule,
    CloudinaryModule,
    CommentsAboutMeModule,
    AutoBlogModule,
  ],
  controllers: [AppController, ImageController],
  providers: [AppService],
})
export class AppModule {}
