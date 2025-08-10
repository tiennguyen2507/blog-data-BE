import { Module } from '@nestjs/common';
import { ContactService } from './contact.service';
import { ContactController } from './contact.controller';
import { DatabaseModule } from '../database/database.module';
import { contactProviders } from '../providers/contact.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [ContactController],
  providers: [ContactService, ...contactProviders],
  exports: [ContactService],
})
export class ContactModule {}
