import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type dataMaterDocument = HydratedDocument<DataMater>;

export const idDataMater = 'DataMater';

@Schema({ timestamps: true })
export class DataMater {
  @Prop()
  id: 'DataMater';

  @Prop({ required: true })
  size: string;
}

export const DataMaterSchema = SchemaFactory.createForClass(DataMater);
