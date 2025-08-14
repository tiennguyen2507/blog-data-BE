import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { DataMaterDto, keyDataMaterArray } from './dto/data-mater.dto';
import { Model } from 'mongoose';
import { DataMater, idDataMater } from 'src/schemas/dataMater.schema';

@Injectable()
export class DataMaterService {
  constructor(@Inject('DATA-MATER_MODEL') private dataMaterModel: Model<DataMater>) {}
  async getDataMater(dataMaterDto: DataMaterDto) {
    if (!keyDataMaterArray.includes[dataMaterDto.key]) {
      throw new HttpException('key no exist', HttpStatus.BAD_REQUEST);
    }
    const dataMater = this.dataMaterModel.findById(idDataMater);

    return dataMater;
  }
}
