import { Module } from '@nestjs/common';
import { DataMaterService } from './data-mater.service';
import { DataMaterController } from './data-mater.controller';
import { dataMaterProviders } from 'src/providers/dataMater.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DataMaterController],
  providers: [DataMaterService, ...dataMaterProviders],
})
export class DataMaterModule {}
