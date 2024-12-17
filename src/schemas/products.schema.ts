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

  @Prop({ required: true })
  sizes: {
    size: 'S' | 'M' | 'L';
    price: number;
    sales: number;
    image: string[];
  }[];

  @Prop({
    enum: ['bakery', 'accessory', 'other'],
    default: 'bakery',
  })
  category: 'bakery' | 'accessory' | 'other';
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
