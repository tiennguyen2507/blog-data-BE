import { Controller, Get, Query } from '@nestjs/common';
import { DataMaterService } from './data-mater.service';
import { DataMaterDto } from './dto/data-mater.dto';

@Controller('data-mater')
export class DataMaterController {
  constructor(private readonly dataMaterService: DataMaterService) {}

  @Get()
  getDataMater(@Query() dataMaterDto: DataMaterDto) {
    return this.dataMaterService.getDataMater(dataMaterDto);
  }
}
