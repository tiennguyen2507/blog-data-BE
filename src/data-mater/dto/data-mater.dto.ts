import { ApiProperty } from '@nestjs/swagger';

export const keyDataMaterArray = ['all', 'size'];

export class DataMaterDto {
  @ApiProperty()
  key: 'all' | 'size';
}
