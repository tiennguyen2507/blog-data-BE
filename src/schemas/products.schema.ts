import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export const PRODUCT_NAME_MODEL = 'PRODUCTS_MODEL';

@Schema({ timestamps: true, id: false })
export class Product {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true, type: Number, min: 0 })
  price: number;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  sales: number;

  @Prop({ required: true, type: String })
  category: string;

  @Prop({ required: true, type: String })
  thumbnail: string;

  @Prop({ required: true, type: Number, min: 0, default: 0 })
  quantity: number;
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
