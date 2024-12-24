import { Module } from '@nestjs/common';
import { ApiCommonService } from './api-common.service';
import { ApiCommonController } from './api-common.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ApiCommonController],
  providers: [ApiCommonService],
})
export class ApiCommonModule {}
