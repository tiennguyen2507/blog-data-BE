import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

export const PRODUCT_NAME_MODEL = 'PRODUCTS_MODEL';

export class Product {
  @Prop({ required: true, type: String })
  title: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: true })
  size: Array<string>;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  sales: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  category: string;

  @Prop({ nullable: true, default: null })
  subImage: string;
}

export const ProductsSchema = SchemaFactory.createForClass(Product);
